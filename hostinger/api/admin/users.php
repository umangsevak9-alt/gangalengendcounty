<?php
require __DIR__ . '/../bootstrap.php';
$me = require_role('admin');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $rows = db()->query("
    SELECT u.id, u.email, u.full_name, u.is_active, u.last_login_at, u.created_at,
           GROUP_CONCAT(ur.role) AS roles
    FROM users u LEFT JOIN user_roles ur ON ur.user_id = u.id
    GROUP BY u.id ORDER BY u.created_at DESC
  ")->fetchAll();
  foreach ($rows as &$r) $r['roles'] = $r['roles'] ? explode(',', $r['roles']) : [];
  json_ok(['items' => $rows]);
}

if ($method === 'POST') {
  // Create a new user OR set a role.
  $b = json_body();
  $action = $b['action'] ?? '';

  if ($action === 'create') {
    $email = v_email($b['email'] ?? '');
    $password = v_str($b['password'] ?? '', 8, 200);
    $fullName = v_str_opt($b['full_name'] ?? null, 200);
    $id = uuidv4();
    $hash = password_hash($password, PASSWORD_BCRYPT);
    try {
      db()->beginTransaction();
      db()->prepare('INSERT INTO users (id, email, password_hash, full_name) VALUES (:i,:e,:p,:n)')
        ->execute([':i'=>$id, ':e'=>$email, ':p'=>$hash, ':n'=>$fullName]);
      db()->prepare('INSERT INTO profiles (id, email, full_name) VALUES (:i,:e,:n)')
        ->execute([':i'=>$id, ':e'=>$email, ':n'=>$fullName]);
      db()->commit();
    } catch (Throwable $e) {
      db()->rollBack();
      if (str_contains($e->getMessage(), 'Duplicate')) json_error(409, 'Email already registered');
      throw $e;
    }
    json_ok(['id' => $id]);
  }

  if ($action === 'set_role') {
    $userId = v_str($b['user_id'] ?? '', 32, 36);
    $role = v_enum($b['role'] ?? '', ['admin','editor']);
    $grant = (bool)($b['grant'] ?? false);
    if ($userId === $me['id'] && $role === 'admin' && !$grant) {
      json_error(400, 'You cannot remove your own admin role.');
    }
    if ($grant) {
      db()->prepare('INSERT IGNORE INTO user_roles (user_id, role) VALUES (:u, :r)')
        ->execute([':u' => $userId, ':r' => $role]);
    } else {
      db()->prepare('DELETE FROM user_roles WHERE user_id = :u AND role = :r')
        ->execute([':u' => $userId, ':r' => $role]);
    }
    json_ok(['ok' => true]);
  }

  if ($action === 'toggle_active') {
    $userId = v_str($b['user_id'] ?? '', 32, 36);
    $active = v_bool($b['is_active'] ?? true);
    if ($userId === $me['id'] && !$active) json_error(400, 'You cannot deactivate yourself.');
    db()->prepare('UPDATE users SET is_active = :a WHERE id = :u')
      ->execute([':a' => $active, ':u' => $userId]);
    json_ok(['ok' => true]);
  }

  json_error(400, 'Unknown action');
}

if ($method === 'DELETE') {
  $b = json_body();
  $userId = v_str($b['user_id'] ?? '', 32, 36);
  if ($userId === $me['id']) json_error(400, 'You cannot delete yourself.');
  db()->prepare('DELETE FROM users WHERE id = :u')->execute([':u' => $userId]);
  json_ok(['ok' => true]);
}

json_error(405, 'Method not allowed');
