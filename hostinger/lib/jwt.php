<?php
// Minimal HS256 JWT implementation — no external deps.
declare(strict_types=1);

function jwt_b64url_encode(string $bin): string {
  return rtrim(strtr(base64_encode($bin), '+/', '-_'), '=');
}
function jwt_b64url_decode(string $s): string {
  $pad = strlen($s) % 4;
  if ($pad) $s .= str_repeat('=', 4 - $pad);
  return base64_decode(strtr($s, '-_', '+/')) ?: '';
}

function jwt_sign(array $payload): string {
  $secret = $_ENV['JWT_SECRET'] ?? '';
  if (strlen($secret) < 32) throw new RuntimeException('JWT_SECRET missing or too short');
  $header = ['alg' => 'HS256', 'typ' => 'JWT'];
  $h = jwt_b64url_encode(json_encode($header, JSON_UNESCAPED_SLASHES));
  $p = jwt_b64url_encode(json_encode($payload, JSON_UNESCAPED_SLASHES));
  $sig = hash_hmac('sha256', "$h.$p", $secret, true);
  return "$h.$p." . jwt_b64url_encode($sig);
}

function jwt_verify(string $token): ?array {
  $parts = explode('.', $token);
  if (count($parts) !== 3) return null;
  [$h, $p, $s] = $parts;
  $secret = $_ENV['JWT_SECRET'] ?? '';
  if (strlen($secret) < 32) return null;
  $expected = jwt_b64url_encode(hash_hmac('sha256', "$h.$p", $secret, true));
  if (!hash_equals($expected, $s)) return null;
  $payload = json_decode(jwt_b64url_decode($p), true);
  if (!is_array($payload)) return null;
  if (isset($payload['exp']) && $payload['exp'] < time()) return null;
  return $payload;
}
