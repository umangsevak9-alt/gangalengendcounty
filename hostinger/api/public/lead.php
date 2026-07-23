<?php
require __DIR__ . '/../bootstrap.php';
require_once dirname(__DIR__, 2) . '/lib/rate-limit.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_error(405, 'Method not allowed');

// Simple abuse guard: max 10 lead submits/min per IP.
$stmt = db()->prepare("SELECT COUNT(*) AS n FROM leads WHERE ip_address = :ip AND created_at > (NOW() - INTERVAL 1 MINUTE)");
$stmt->execute([':ip' => client_ip()]);
if ((int)$stmt->fetch()['n'] >= 10) json_error(429, 'Too many submissions');

$b = json_body();
$name = v_str($b['name'] ?? '', 1, 200);
$phone = v_str($b['phone'] ?? '', 5, 40);
$email = isset($b['email']) && $b['email'] !== '' ? v_email($b['email']) : null;
$interest = v_str_opt($b['property_interest'] ?? null, 200);
$message = v_str_opt($b['message'] ?? null, 2000);
$source = v_str_opt($b['source'] ?? 'contact_form', 50) ?? 'contact_form';

$id = uuidv4();
db()->prepare('INSERT INTO leads (id, name, phone, email, property_interest, message, source, ip_address)
  VALUES (:id,:n,:p,:e,:pi,:m,:s,:ip)')
  ->execute([
    ':id'=>$id, ':n'=>$name, ':p'=>$phone, ':e'=>$email,
    ':pi'=>$interest, ':m'=>$message, ':s'=>$source, ':ip'=>client_ip(),
  ]);

json_ok(['ok' => true, 'id' => $id]);
