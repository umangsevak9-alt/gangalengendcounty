<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';

function client_ip(): string {
  $ip = $_SERVER['HTTP_CF_CONNECTING_IP']
    ?? ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? '')
    ?: ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
  if (strpos($ip, ',') !== false) $ip = trim(explode(',', $ip)[0]);
  return substr($ip, 0, 45);
}

function record_login_attempt(?string $email, bool $ok): void {
  $stmt = db()->prepare('INSERT INTO login_attempts (ip_address, email, succeeded) VALUES (:ip, :em, :ok)');
  $stmt->execute([':ip' => client_ip(), ':em' => $email, ':ok' => $ok ? 1 : 0]);
}

function login_rate_limited(): bool {
  $stmt = db()->prepare("
    SELECT COUNT(*) AS n FROM login_attempts
    WHERE ip_address = :ip AND succeeded = 0 AND attempted_at > (NOW() - INTERVAL 1 MINUTE)
  ");
  $stmt->execute([':ip' => client_ip()]);
  $row = $stmt->fetch();
  return ((int)$row['n']) >= 5;
}
