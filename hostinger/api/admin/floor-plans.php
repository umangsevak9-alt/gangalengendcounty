<?php
require __DIR__ . '/../bootstrap.php';
require_once dirname(__DIR__, 2) . '/lib/crud.php';
$cols = ['name', 'tower', 'area', 'price', 'status', 'is_limited', 'image_path', 'sort_order'];
crud_handle('floor_plans', $cols, function($b) {
  return [
    'name' => v_str($b['name'] ?? '', 1, 200),
    'tower' => v_str_opt($b['tower'] ?? null, 100),
    'area' => v_str_opt($b['area'] ?? null, 100),
    'price' => v_str_opt($b['price'] ?? null, 100),
    'status' => v_str_opt($b['status'] ?? null, 100),
    'is_limited' => v_bool($b['is_limited'] ?? false),
    'image_path' => v_str_opt($b['image_path'] ?? null, 500),
    'sort_order' => v_int($b['sort_order'] ?? 0, -10000, 10000),
  ];
});
