<?php
require __DIR__ . '/../bootstrap.php';
require_once dirname(__DIR__, 2) . '/lib/crud.php';
$cols = ['name', 'role', 'quote', 'rating', 'provider', 'video_url', 'video_path', 'image_path', 'sort_order', 'is_active'];
crud_handle('testimonials', $cols, function($b) {
  return [
    'name' => v_str($b['name'] ?? '', 1, 200),
    'role' => v_str_opt($b['role'] ?? null, 200),
    'quote' => v_str($b['quote'] ?? '', 1, 2000),
    'rating' => v_int($b['rating'] ?? 5, 1, 5),
    'provider' => v_enum($b['provider'] ?? 'none', ['none','upload','youtube','vimeo']),
    'video_url' => v_str_opt($b['video_url'] ?? null, 1000),
    'video_path' => v_str_opt($b['video_path'] ?? null, 500),
    'image_path' => v_str_opt($b['image_path'] ?? null, 500),
    'sort_order' => v_int($b['sort_order'] ?? 0, -10000, 10000),
    'is_active' => v_bool($b['is_active'] ?? true),
  ];
});
