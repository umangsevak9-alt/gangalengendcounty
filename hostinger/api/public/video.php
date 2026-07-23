<?php
require __DIR__ . '/../bootstrap.php';
$row = db()->query('SELECT * FROM video_section WHERE is_active = 1 ORDER BY updated_at DESC LIMIT 1')->fetch();
if (!$row) json_ok(null);
json_ok([
  'id' => $row['id'],
  'title' => $row['title'],
  'subtitle' => $row['subtitle'],
  'provider' => $row['provider'],
  'video_url' => $row['video_url'],
  'video_signed_url' => $row['video_path'] ? '/uploads/' . $row['video_path'] : null,
  'poster_url' => $row['poster_path'] ? '/uploads/' . $row['poster_path'] : null,
  'aspect_ratio' => $row['aspect_ratio'],
  'aspect_ratio_mobile' => $row['aspect_ratio_mobile'],
]);
