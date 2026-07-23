<?php
require __DIR__ . '/../bootstrap.php';
require_role('admin', 'editor');
require_once dirname(__DIR__, 2) . '/lib/crud.php';

$method = $_SERVER['REQUEST_METHOD'];
$resource = $_GET['type'] ?? 'settings';

if ($resource === 'settings') {
  if ($method === 'GET') {
    $s = db()->query('SELECT * FROM location_settings WHERE is_active = 1 ORDER BY updated_at DESC LIMIT 1')->fetch();
    json_ok($s ?: null);
  }
  if ($method === 'POST') {
    $b = json_body();
    $data = [
      'heading' => v_str($b['heading'] ?? '', 1, 300),
      'subtitle' => v_str_opt($b['subtitle'] ?? null, 500),
      'address' => v_str_opt($b['address'] ?? null, 2000),
      'map_embed_url' => v_str_opt($b['map_embed_url'] ?? null, 2000),
      'directions_url' => v_str_opt($b['directions_url'] ?? null, 2000),
      'is_active' => v_bool($b['is_active'] ?? true),
    ];
    $cols = array_keys($data);
    $id = crud_upsert('location_settings', $cols, $data, $b['id'] ?? null);
    json_ok(['id' => $id]);
  }
}
if ($resource === 'landmarks') {
  $cols = ['label', 'travel_time', 'icon_key', 'sort_order'];
  crud_handle('location_landmarks', $cols, function($b) {
    return [
      'label' => v_str($b['label'] ?? '', 1, 200),
      'travel_time' => v_str_opt($b['travel_time'] ?? null, 100),
      'icon_key' => v_str($b['icon_key'] ?? 'MapPin', 1, 50),
      'sort_order' => v_int($b['sort_order'] ?? 0, -10000, 10000),
    ];
  });
}
json_error(400, 'Unknown resource');
