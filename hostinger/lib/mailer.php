<?php
// SMTP mailer via PHP's native `mail()` fallback OR PHPMailer if available.
// Hostinger provides PHPMailer via Composer easily; for zero-dep we use a small SMTP client.
declare(strict_types=1);

function send_mail(string $toEmail, string $toName, string $subject, string $html): bool {
  $host = $_ENV['SMTP_HOST'] ?? '';
  $port = (int)($_ENV['SMTP_PORT'] ?? 465);
  $user = $_ENV['SMTP_USER'] ?? '';
  $pass = $_ENV['SMTP_PASS'] ?? '';
  $from = $_ENV['SMTP_FROM'] ?? $user;
  $fromName = $_ENV['SMTP_FROM_NAME'] ?? 'Website';

  if (!$host || !$user || !$pass) {
    error_log('[mailer] SMTP env not configured');
    return false;
  }

  $eol = "\r\n";
  $boundary = 'b_' . bin2hex(random_bytes(8));
  $headers  = "From: {$fromName} <{$from}>" . $eol;
  $headers .= "To: {$toName} <{$toEmail}>" . $eol;
  $headers .= "Subject: {$subject}" . $eol;
  $headers .= "MIME-Version: 1.0" . $eol;
  $headers .= "Content-Type: text/html; charset=UTF-8" . $eol;
  $headers .= "Content-Transfer-Encoding: 8bit" . $eol;

  // Simple SMTPS connection (port 465 = implicit TLS).
  $transport = ($port === 465) ? "ssl://{$host}" : $host;
  $fp = @stream_socket_client("{$transport}:{$port}", $errno, $errstr, 10);
  if (!$fp) { error_log("[mailer] connect fail: $errstr"); return false; }

  $read = function() use ($fp) { return fgets($fp, 1024); };
  $send = function($cmd) use ($fp) { fwrite($fp, $cmd . "\r\n"); };

  $read();
  $send("EHLO localhost"); while (($l = $read()) && substr($l, 3, 1) === '-') {}
  if ($port === 587) {
    $send("STARTTLS"); $read();
    stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
    $send("EHLO localhost"); while (($l = $read()) && substr($l, 3, 1) === '-') {}
  }
  $send("AUTH LOGIN"); $read();
  $send(base64_encode($user)); $read();
  $send(base64_encode($pass)); $r = $read();
  if (strpos($r, '235') !== 0) { fclose($fp); error_log("[mailer] auth fail: $r"); return false; }
  $send("MAIL FROM:<{$from}>"); $read();
  $send("RCPT TO:<{$toEmail}>"); $read();
  $send("DATA"); $read();
  fwrite($fp, $headers . "\r\n" . $html . "\r\n.\r\n");
  $r = $read();
  $send("QUIT"); fclose($fp);
  return strpos($r, '250') === 0;
}
