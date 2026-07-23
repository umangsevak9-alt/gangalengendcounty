<?php
require __DIR__ . '/../bootstrap.php';
require_once dirname(__DIR__, 2) . '/lib/crud.php';
$cols = ['title', 'image_path', 'aspect', 'sort_order'];
crud_handle('gallery_images', $cols, function($b) {
  return [
    'title' => v_str_opt($b['title'] ?? null, 300),
    'image_path' => v_str($b['image_path'] ?? '', 1, 500),
    'aspect' => v_str($b['aspect'] ?? 'wide', 1, 20),
    'sort_order' => v_int($b['sort_order'] ?? 0, -10000, 10000),
  ];
});
