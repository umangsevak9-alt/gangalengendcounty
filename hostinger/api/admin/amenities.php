<?php
require __DIR__ . '/../bootstrap.php';
require_once dirname(__DIR__, 2) . '/lib/crud.php';

$cols = ['title', 'note', 'image_path', 'sort_order'];
crud_handle('amenities', $cols, function($b) {
  return [
    'title' => v_str($b['title'] ?? '', 1, 200),
    'note' => v_str_opt($b['note'] ?? null, 2000),
    'image_path' => v_str_opt($b['image_path'] ?? null, 500),
    'sort_order' => v_int($b['sort_order'] ?? 0, -10000, 10000),
  ];
});
