<?php
require __DIR__ . '/../bootstrap.php';
$u = current_user();
if (!$u) json_ok(null);
json_ok([
  'id' => $u['id'],
  'email' => $u['email'],
  'full_name' => $u['full_name'],
  'roles' => $u['roles'],
  'isAdmin' => in_array('admin', $u['roles'], true),
  'isEditor' => in_array('editor', $u['roles'], true) || in_array('admin', $u['roles'], true),
]);
