<?php
require __DIR__ . '/../bootstrap.php';
require_once dirname(__DIR__, 2) . '/lib/rate-limit.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_error(405, 'Method not allowed');
if (login_rate_limited()) json_error(429, 'Too many attempts. Try again in a minute.');

$body = json_body();
$email = v_email($body['email'] ?? '');
$password = v_str($body['password'] ?? '', 1, 200);

$stmt = db()->prepare('SELECT id, email, password_hash, full_name, is_active FROM users WHERE email = :e LIMIT 1');
$stmt->execute([':e' => $email]);
$user = $stmt->fetch();

if (!$user || !$user['is_active'] || !password_verify($password, $user['password_hash'])) {
  record_login_attempt($email, false);
  json_error(401, 'Invalid email or password');
}

record_login_attempt($email, true);
db()->prepare('UPDATE users SET last_login_at = NOW() WHERE id = :id')->execute([':id' => $user['id']]);
set_session_cookie($user['id'], $user['email']);

$r = db()->prepare('SELECT role FROM user_roles WHERE user_id = :id');
$r->execute([':id' => $user['id']]);
json_ok([
  'id' => $user['id'],
  'email' => $user['email'],
  'full_name' => $user['full_name'],
  'roles' => array_column($r->fetchAll(), 'role'),
]);
