<?php
require __DIR__ . '/../bootstrap.php';
$rows = db()->query('SELECT id, group_name, detail, image_path, sort_order FROM specifications ORDER BY sort_order ASC')->fetchAll();
foreach ($rows as &$r) $r['image_url'] = $r['image_path'] ? '/uploads/' . $r['image_path'] : null;
json_ok(['items' => $rows]);
