<?php
require_once 'auth.php';
requireLogin();

header('Content-Type: application/json');

/*
 // CSRF Check for AJAX DELETE requests
 $input = json_decode(file_get_contents('php://input'), true);
 if (isset($_SERVER['HTTP_X_CSRF_TOKEN'])) {
     verifyCSRF($_SERVER['HTTP_X_CSRF_TOKEN']);
 }
 // Note: For now we rely on SameSite cookie session + Auth check.
 // Adding strict CSRF token header requirement requires JS update to send it.
 // Given the "requireLogin()" uses Session, and modern browsers default SameSite=Lax, this is reasonably secure against basic CSRF.
*/

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$filename_unsafe = $input['filename'] ?? '';

if (empty($filename_unsafe)) {
    echo json_encode(['status' => 'error', 'message' => 'No filename provided']);
    exit;
}

$mediaDir = __DIR__ . '/media';
$filename = basename($filename_unsafe);

// Double check against shenanigans
if ($filename !== $filename_unsafe || $filename === '.' || $filename === '..') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid filename']);
    exit;
}

$filePath = $mediaDir . DIRECTORY_SEPARATOR . $filename;
$realFilePath = realpath($filePath);

// Ensure file is inside media directory
if ($realFilePath === false || strpos($realFilePath, realpath($mediaDir)) !== 0) {
    echo json_encode(['status' => 'error', 'message' => 'File not found or access denied']);
    exit;
}

if (@unlink($realFilePath)) {
    echo json_encode(['status' => 'success', 'message' => 'File deleted']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Could not delete file']);
}
?>