<?php
require __DIR__ . '/../bootstrap.php';
require_once dirname(__DIR__, 2) . '/lib/crud.php';
$cols = ['group_name', 'detail', 'image_path', 'sort_order'];
crud_handle('specifications', $cols, function($b) {
  return [
    'group_name' => v_str($b['group_name'] ?? '', 1, 200),
    'detail' => v_str($b['detail'] ?? '', 1, 2000),
    'image_path' => v_str_opt($b['image_path'] ?? null, 500),
    'sort_order' => v_int($b['sort_order'] ?? 0, -10000, 10000),
  ];
});
