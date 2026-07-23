<?php
require __DIR__ . '/../bootstrap.php';
$rows = db()->query('SELECT id, title, image_path, aspect, sort_order FROM gallery_images ORDER BY sort_order ASC')->fetchAll();
foreach ($rows as &$r) $r['image_url'] = '/uploads/' . $r['image_path'];
json_ok(['items' => $rows]);
