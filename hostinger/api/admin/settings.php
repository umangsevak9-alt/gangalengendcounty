<?php
require __DIR__ . '/../bootstrap.php';
require_role('admin', 'editor');

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'GET') {
  $stmt = db()->query('SELECT * FROM site_settings ORDER BY updated_at DESC LIMIT 1');
  json_ok($stmt->fetch() ?: null);
}
if ($method === 'POST') {
  $b = json_body();
  $data = [
    'brand_name' => v_str($b['brand_name'] ?? '', 1, 200),
    'brand_code' => v_str_opt($b['brand_code'] ?? '', 100) ?? '',
    'developer'  => v_str_opt($b['developer']  ?? '', 200) ?? '',
    'partner'    => v_str_opt($b['partner']    ?? '', 200) ?? '',
    'location'   => v_str_opt($b['location']   ?? '', 200) ?? '',
    'rera'       => v_str_opt($b['rera']       ?? '', 200) ?? '',
    'phone'      => v_str_opt($b['phone']      ?? '', 50)  ?? '',
    'whatsapp'   => v_str_opt($b['whatsapp']   ?? '', 50)  ?? '',
    'email'      => v_str_opt($b['email']      ?? '', 200) ?? '',
    'whatsapp_message' => v_str_opt($b['whatsapp_message'] ?? '', 500) ?? '',
    'hero_image_path'  => v_str_opt($b['hero_image_path']  ?? null, 500),
  ];
  $cols = array_keys($data);
  require_once dirname(__DIR__, 2) . '/lib/crud.php';
  $id = crud_upsert('site_settings', $cols, $data, $b['id'] ?? null);
  json_ok(['id' => $id]);
}
json_error(405, 'Method not allowed');
