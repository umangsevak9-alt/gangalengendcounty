<?php
require __DIR__ . '/../bootstrap.php';
require_role('admin', 'editor');
require_once dirname(__DIR__, 2) . '/lib/crud.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'GET') {
  $stmt = db()->query('SELECT * FROM video_section ORDER BY updated_at DESC LIMIT 1');
  json_ok($stmt->fetch() ?: null);
}
if ($method === 'POST') {
  $b = json_body();
  $data = [
    'title' => v_str($b['title'] ?? '', 1, 300),
    'subtitle' => v_str_opt($b['subtitle'] ?? null, 500),
    'provider' => v_enum($b['provider'] ?? 'upload', ['upload','youtube','vimeo']),
    'video_url' => v_str_opt($b['video_url'] ?? null, 1000),
    'video_path' => v_str_opt($b['video_path'] ?? null, 500),
    'poster_path' => v_str_opt($b['poster_path'] ?? null, 500),
    'aspect_ratio' => v_enum($b['aspect_ratio'] ?? '16/9', ['16/9','4/3','1/1','9/16','21/9']),
    'aspect_ratio_mobile' => v_enum($b['aspect_ratio_mobile'] ?? '9/16', ['16/9','4/3','1/1','9/16','21/9']),
    'is_active' => v_bool($b['is_active'] ?? true),
  ];
  $cols = array_keys($data);
  $id = crud_upsert('video_section', $cols, $data, $b['id'] ?? null);
  json_ok(['id' => $id]);
}
json_error(405, 'Method not allowed');
