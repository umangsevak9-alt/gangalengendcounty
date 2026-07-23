<?php
// PDO singleton — prepared statements only.
declare(strict_types=1);

function db(): PDO {
  static $pdo = null;
  if ($pdo instanceof PDO) return $pdo;

  $host = $_ENV['DB_HOST'] ?? 'localhost';
  $port = $_ENV['DB_PORT'] ?? '3306';
  $name = $_ENV['DB_NAME'] ?? '';
  $user = $_ENV['DB_USER'] ?? '';
  $pass = $_ENV['DB_PASS'] ?? '';

  $dsn = "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4";
  $pdo = new PDO($dsn, $user, $pass, [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
  ]);
  return $pdo;
}

function uuidv4(): string {
  $data = random_bytes(16);
  $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
  $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
  return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}
