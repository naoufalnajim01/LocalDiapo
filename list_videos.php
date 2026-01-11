<?php
require_once 'auth.php';
requireLogin();

header('Content-Type: application/json');

$mediaDir = __DIR__ . '/media';
$mediaUrl = 'media/';
$allowedExtensions = ['jpg', 'jpeg', 'png', 'mp4', 'webm', 'pdf'];

if (!is_dir($mediaDir)) {
    echo json_encode(['media' => []]);
    exit;
}

$files = scandir($mediaDir);
$mediaList = [];

foreach ($files as $file) {
    if ($file === '.' || $file === '..') continue;
    
    // Skip hidden files
    if (strpos($file, '.') === 0) continue; 
    
    $filePath = $mediaDir . '/' . $file;
    if (is_file($filePath)) {
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (in_array($ext, $allowedExtensions)) {
            $type = 'unknown';
            if (in_array($ext, ['jpg', 'jpeg', 'png'])) $type = 'image';
            elseif (in_array($ext, ['mp4', 'webm'])) $type = 'video';
            elseif ($ext === 'pdf') $type = 'pdf';
            
            // Use rawurlencode to ensure spaces and special chars are handled safely in URLs
            // But verify client side decoding matches. JavaScript encodeURIComponent handles most.
            // Using rawurlencode compatible with RFC 3986
            $mediaList[] = [
                'filename' => $file,
                'path' => $mediaUrl . rawurlencode($file),
                'type' => $type
            ];
        }
    }
}

echo json_encode(['media' => $mediaList]);
?>