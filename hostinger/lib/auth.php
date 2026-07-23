<?php
declare(strict_types=1);
require_once __DIR__ . '/jwt.php';
require_once __DIR__ . '/db.php';

const AUTH_COOKIE = 'nova_session';

function current_user(): ?array {
  $token = $_COOKIE[AUTH_COOKIE] ?? '';
  if (!$token) return null;
  $payload = jwt_verify($token);
  if (!$payload || empty($payload['sub'])) return null;
  $stmt = db()->prepare('SELECT id, email, full_name, is_active FROM users WHERE id = :id LIMIT 1');
  $stmt->execute([':id' => $payload['sub']]);
  $user = $stmt->fetch();
  if (!$user || !$user['is_active']) return null;
  $r = db()->prepare('SELECT role FROM user_roles WHERE user_id = :id');
  $r->execute([':id' => $user['id']]);
  $user['roles'] = array_column($r->fetchAll(), 'role');
  return $user;
}

function set_session_cookie(string $userId, string $email): void {
  $ttl = (int)($_ENV['JWT_TTL_DAYS'] ?? 7) * 86400;
  $token = jwt_sign([
    'sub' => $userId,
    'email' => $email,
    'iat' => time(),
    'exp' => time() + $ttl,
  ]);
  setcookie(AUTH_COOKIE, $token, [
    'expires'  => time() + $ttl,
    'path'     => '/',
    'secure'   => true,
    'httponly' => true,
    'samesite' => 'Strict',
  ]);
}

function clear_session_cookie(): void {
  setcookie(AUTH_COOKIE, '', [
    'expires' => time() - 3600, 'path' => '/', 'secure' => true, 'httponly' => true, 'samesite' => 'Strict',
  ]);
}

function require_login(): array {
  $u = current_user();
  if (!$u) json_error(401, 'Unauthorized');
  return $u;
}

function require_role(string ...$roles): array {
  $u = require_login();
  foreach ($roles as $r) if (in_array($r, $u['roles'], true)) return $u;
  json_error(403, 'Forbidden');
}

// CSRF: reject state-changing requests unless Origin matches APP_URL.
function verify_origin(): void {
  $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
  if (in_array($method, ['GET', 'HEAD', 'OPTIONS'], true)) return;
  $appUrl = $_ENV['APP_URL'] ?? '';
  if (!$appUrl) return;
  $expected = parse_url($appUrl, PHP_URL_HOST);
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  $referer = $_SERVER['HTTP_REFERER'] ?? '';
  $ok = false;
  foreach ([$origin, $referer] as $h) {
    if (!$h) continue;
    $host = parse_url($h, PHP_URL_HOST);
    if ($host && $host === $expected) { $ok = true; break; }
  }
  if (!$ok) json_error(403, 'Bad origin');
}
