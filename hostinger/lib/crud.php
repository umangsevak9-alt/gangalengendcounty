<?php
// Generic CRUD helpers used by admin endpoints. Kept tiny + readable.
declare(strict_types=1);

function crud_list(string $table, array $columns, string $order = 'sort_order ASC, created_at DESC'): array {
  $cols = implode(', ', array_map(fn($c) => "`$c`", $columns));
  $sql = "SELECT $cols FROM `$table` ORDER BY $order";
  return db()->query($sql)->fetchAll();
}

function crud_upsert(string $table, array $columns, array $data, ?string $id): string {
  $id = $id ?: uuidv4();
  $existing = db()->prepare("SELECT id FROM `$table` WHERE id = :id");
  $existing->execute([':id' => $id]);
  if ($existing->fetch()) {
    $sets = implode(', ', array_map(fn($c) => "`$c` = :$c", $columns));
    $sql = "UPDATE `$table` SET $sets WHERE id = :id";
  } else {
    $colList = implode(', ', array_map(fn($c) => "`$c`", array_merge(['id'], $columns)));
    $vals = implode(', ', array_map(fn($c) => ":$c", array_merge(['id'], $columns)));
    $sql = "INSERT INTO `$table` ($colList) VALUES ($vals)";
  }
  $params = [':id' => $id];
  foreach ($columns as $c) $params[":$c"] = $data[$c] ?? null;
  db()->prepare($sql)->execute($params);
  return $id;
}

function crud_delete(string $table, string $id): void {
  db()->prepare("DELETE FROM `$table` WHERE id = :id")->execute([':id' => $id]);
}

// Route based on HTTP method + `id` field in body.
function crud_handle(string $table, array $columns, callable $validate, string $requiredRole = 'editor'): void {
  $method = $_SERVER['REQUEST_METHOD'];
  if ($method === 'GET') {
    require_role('admin', 'editor');
    json_ok(['items' => crud_list($table, array_merge(['id'], $columns))]);
  }
  if ($method === 'POST') {
    require_role('admin', 'editor');
    $body = json_body();
    $data = $validate($body);
    $id = crud_upsert($table, $columns, $data, $body['id'] ?? null);
    json_ok(['id' => $id]);
  }
  if ($method === 'DELETE') {
    require_role('admin', 'editor');
    $body = json_body();
    $id = v_str($body['id'] ?? '', 32, 36);
    crud_delete($table, $id);
    json_ok(['ok' => true]);
  }
  json_error(405, 'Method not allowed');
}
