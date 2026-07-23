<?php
require __DIR__ . '/../bootstrap.php';
$rows = db()->query('SELECT id, question, answer, sort_order FROM faqs ORDER BY sort_order ASC')->fetchAll();
json_ok(['items' => $rows]);
