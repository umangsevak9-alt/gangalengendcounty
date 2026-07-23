<?php
require __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_error(405, 'Method not allowed');
$body = json_body();
$token = v_str($body['token'] ?? '', 32, 128);
$password = v_str($body['password'] ?? '', 8, 200);

$hash = hash('sha256', $token);
$stmt = db()->prepare('SELECT user_id, expires_at, used_at FROM password_resets WHERE token_hash = :h LIMIT 1');
$stmt->execute([':h' => $hash]);
$row = $stmt->fetch();
if (!$row || $row['used_at'] || strtotime($row['expires_at']) < time()) {
  json_error(400, 'Invalid or expired token');
}
$newHash = password_hash($password, PASSWORD_BCRYPT);
db()->beginTransaction();
try {
  db()->prepare('UPDATE users SET password_hash = :p WHERE id = :u')
    ->execute([':p' => $newHash, ':u' => $row['user_id']]);
  db()->prepare('UPDATE password_resets SET used_at = NOW() WHERE token_hash = :h')
    ->execute([':h' => $hash]);
  db()->commit();
} catch (Throwable $e) {
  db()->rollBack();
  throw $e;
}
json_ok(['ok' => true]);
