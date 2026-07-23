<?php
require __DIR__ . '/../bootstrap.php';
$rows = db()->query('SELECT id, name, tower, area, price, status, is_limited, image_path, sort_order FROM floor_plans ORDER BY sort_order ASC')->fetchAll();
foreach ($rows as &$r) {
  $r['is_limited'] = (bool)$r['is_limited'];
  $r['image_url'] = $r['image_path'] ? '/uploads/' . $r['image_path'] : null;
}
json_ok(['items' => $rows]);
