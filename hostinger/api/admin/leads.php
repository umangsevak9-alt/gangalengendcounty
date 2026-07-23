<?php
require __DIR__ . '/../bootstrap.php';
require_role('admin', 'editor');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  // CSV export?
  if (($_GET['format'] ?? '') === 'csv') {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="leads.csv"');
    $out = fopen('php://output', 'w');
    fputcsv($out, ['id','name','phone','email','property_interest','message','source','created_at']);
    $stmt = db()->query('SELECT id,name,phone,email,property_interest,message,source,created_at FROM leads ORDER BY created_at DESC');
    while ($row = $stmt->fetch(PDO::FETCH_NUM)) fputcsv($out, $row);
    fclose($out);
    exit;
  }
  $rows = db()->query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 1000')->fetchAll();
  json_ok(['items' => $rows]);
}
if ($method === 'DELETE') {
  require_role('admin');
  $body = json_body();
  $id = v_str($body['id'] ?? '', 32, 36);
  db()->prepare('DELETE FROM leads WHERE id = :id')->execute([':id' => $id]);
  json_ok(['ok' => true]);
}
json_error(405, 'Method not allowed');
