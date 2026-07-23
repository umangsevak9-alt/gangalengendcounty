<?php
declare(strict_types=1);

function json_body(): array {
  $raw = file_get_contents('php://input');
  if (!$raw) return [];
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}

function json_ok($data = null, int $status = 200): void {
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($data ?? ['ok' => true], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function json_error(int $status, string $message, array $extra = []): void {
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode(array_merge(['error' => $message], $extra));
  exit;
}

function v_str($val, int $min = 0, int $max = 1000): string {
  if (!is_string($val)) json_error(422, 'Invalid string');
  $val = trim($val);
  $len = mb_strlen($val);
  if ($len < $min || $len > $max) json_error(422, "String length must be $min..$max");
  return $val;
}
function v_str_opt($val, int $max = 1000): ?string {
  if ($val === null || $val === '') return null;
  return v_str($val, 0, $max);
}
function v_email($val): string {
  $v = v_str($val, 3, 254);
  if (!filter_var($v, FILTER_VALIDATE_EMAIL)) json_error(422, 'Invalid email');
  return strtolower($v);
}
function v_int($val, int $min = PHP_INT_MIN, int $max = PHP_INT_MAX): int {
  if (!is_int($val) && !ctype_digit((string)$val) && !(is_string($val) && preg_match('/^-?\d+$/', $val))) {
    json_error(422, 'Invalid integer');
  }
  $i = (int)$val;
  if ($i < $min || $i > $max) json_error(422, "Integer must be $min..$max");
  return $i;
}
function v_bool($val): int { return $val ? 1 : 0; }
function v_enum($val, array $allowed): string {
  $v = is_string($val) ? $val : '';
  if (!in_array($v, $allowed, true)) json_error(422, 'Invalid value');
  return $v;
}
