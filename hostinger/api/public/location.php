<?php
require __DIR__ . '/../bootstrap.php';
$settings = db()->query('SELECT * FROM location_settings WHERE is_active = 1 ORDER BY updated_at DESC LIMIT 1')->fetch();
$landmarks = db()->query('SELECT id, label, travel_time, icon_key, sort_order FROM location_landmarks ORDER BY sort_order ASC')->fetchAll();
json_ok([ 'settings' => $settings ?: null, 'landmarks' => $landmarks ]);
