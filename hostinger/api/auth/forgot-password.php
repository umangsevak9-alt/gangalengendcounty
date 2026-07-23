<?php
require __DIR__ . '/../bootstrap.php';
require_once dirname(__DIR__, 2) . '/lib/mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_error(405, 'Method not allowed');
$body = json_body();
$email = v_email($body['email'] ?? '');

$stmt = db()->prepare('SELECT id, email, full_name FROM users WHERE email = :e LIMIT 1');
$stmt->execute([':e' => $email]);
$user = $stmt->fetch();

// Always respond OK — do not reveal whether an email is registered.
if ($user) {
  $token = bin2hex(random_bytes(32));
  $hash = hash('sha256', $token);
  $expires = (new DateTime('+1 hour'))->format('Y-m-d H:i:s');
  db()->prepare('INSERT INTO password_resets (token_hash, user_id, expires_at) VALUES (:h, :u, :e)')
    ->execute([':h' => $hash, ':u' => $user['id'], ':e' => $expires]);

  $link = rtrim($_ENV['APP_URL'] ?? '', '/') . '/reset-password?token=' . $token;
  $html = "<p>Hi " . htmlspecialchars($user['full_name'] ?: '') . ",</p>
    <p>Reset your password using the link below (valid for 1 hour):</p>
    <p><a href=\"$link\">$link</a></p>
    <p>If you didn't request this, ignore this email.</p>";
  send_mail($user['email'], $user['full_name'] ?: '', 'Reset your password', $html);
}
json_ok(['ok' => true]);
