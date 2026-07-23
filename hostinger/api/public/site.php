<?php
require __DIR__ . '/../bootstrap.php';
$row = db()->query('SELECT brand_name, brand_code, developer, partner, location, rera, phone, whatsapp, email, whatsapp_message, hero_image_path FROM site_settings ORDER BY updated_at DESC LIMIT 1')->fetch();
if (!$row) json_ok(null);
$row['hero_image_url'] = $row['hero_image_path'] ? '/uploads/' . $row['hero_image_path'] : null;
json_ok($row);
