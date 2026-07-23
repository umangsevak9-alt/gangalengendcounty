<?php
require __DIR__ . '/../bootstrap.php';
$rows = db()->query('SELECT id, name, role, quote, rating, provider, video_url, video_path, image_path, sort_order FROM testimonials WHERE is_active = 1 ORDER BY sort_order ASC')->fetchAll();
foreach ($rows as &$r) {
  $r['video_signed_url'] = $r['video_path'] ? '/uploads/' . $r['video_path'] : null;
  $r['image_url'] = $r['image_path'] ? '/uploads/' . $r['image_path'] : null;
}
json_ok(['items' => $rows]);
