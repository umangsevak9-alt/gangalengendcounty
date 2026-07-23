<?php
require __DIR__ . '/../bootstrap.php';
require_role('admin', 'editor');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_error(405, 'Method not allowed');
if (empty($_FILES['file'])) json_error(400, 'No file uploaded');

$folder = $_POST['folder'] ?? 'images';
$allowedFolders = ['images','videos','documents','profile','services'];
if (!in_array($folder, $allowedFolders, true)) json_error(400, 'Invalid folder');

$file = $_FILES['file'];
if ($file['error'] !== UPLOAD_ERR_OK) json_error(400, 'Upload failed');

$maxMb = (int)($_ENV['UPLOAD_MAX_MB'] ?? 25);
if ($file['size'] > $maxMb * 1024 * 1024) json_error(413, 'File too large');

// Sniff MIME via finfo, don't trust the client.
$fi = new finfo(FILEINFO_MIME_TYPE);
$mime = $fi->file($file['tmp_name']);
$allowed = [
  'image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif', 'image/svg+xml' => 'svg',
  'video/mp4' => 'mp4', 'video/webm' => 'webm', 'video/quicktime' => 'mov',
  'application/pdf' => 'pdf',
];
if (!isset($allowed[$mime])) json_error(415, "Unsupported file type: $mime");
$ext = $allowed[$mime];

$safeName = bin2hex(random_bytes(12)) . '.' . $ext;
$dest = dirname(__DIR__, 2) . "/uploads/$folder/$safeName";
if (!move_uploaded_file($file['tmp_name'], $dest)) json_error(500, 'Save failed');
@chmod($dest, 0644);

json_ok([
  'path' => "$folder/$safeName",
  'url' => '/uploads/' . "$folder/$safeName",
]);
