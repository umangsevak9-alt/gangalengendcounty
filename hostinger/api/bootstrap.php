<?php
// Loaded by every API endpoint. Sets up env, error handling, CORS, DB.
declare(strict_types=1);

// Load .env from project root (one dir above /api).
$envFile = dirname(__DIR__) . '/.env';
if (is_file($envFile)) {
  foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
    if ($line === '' || $line[0] === '#') continue;
    if (!str_contains($line, '=')) continue;
    [$k, $v] = explode('=', $line, 2);
    $k = trim($k); $v = trim($v, " \t\"'");
    if ($k !== '' && !isset($_ENV[$k])) $_ENV[$k] = $v;
  }
}

// Error handling — never leak stack traces to clients.
ini_set('display_errors', '0');
error_reporting(E_ALL);
set_exception_handler(function(Throwable $e) {
  error_log('[api] ' . $e->getMessage() . "\n" . $e->getTraceAsString());
  if (!headers_sent()) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
  }
  echo json_encode(['error' => 'Internal server error']);
  exit;
});

require_once dirname(__DIR__) . '/lib/validate.php';
require_once dirname(__DIR__) . '/lib/db.php';
require_once dirname(__DIR__) . '/lib/auth.php';

// Same-origin only. CORS is intentionally strict.
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Optional CORS if you host the frontend on a different subdomain.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$appUrl = $_ENV['APP_URL'] ?? '';
if ($origin && $appUrl && rtrim($origin, '/') === rtrim($appUrl, '/')) {
  header("Access-Control-Allow-Origin: $origin");
  header("Access-Control-Allow-Credentials: true");
  header("Access-Control-Allow-Headers: Content-Type");
  header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }

verify_origin();
