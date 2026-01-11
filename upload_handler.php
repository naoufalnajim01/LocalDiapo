<?php
require_once 'auth.php';
requireLogin();

header('Content-Type: application/json');

/*
 // Security: Max file size and allowed extensions
 // These should match client side logic
*/
$uploadDir = __DIR__ . '/media/';
$maxFileSize = 100 * 1024 * 1024; // 100MB
$allowedExtensions = ['jpg', 'jpeg', 'png', 'mp4', 'webm', 'pdf'];

$response = ['status' => 'success', 'messages' => []];

if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        echo json_encode(['status' => 'error', 'messages' => ['Server Error: Cannot create media directory']]);
        exit;
    }
    // Secure media dir execution
    file_put_contents($uploadDir . '.htaccess', "Options -Indexes\n<Files *.php>\ndeny from all\n</Files>");
}

if (isset($_FILES['mediaFiles'])) {
    $files = $_FILES['mediaFiles'];
    $fileCount = count($files['name']);

    for ($i = 0; $i < $fileCount; $i++) {
        $fileName = $files['name'][$i];
        $fileTmp = $files['tmp_name'][$i];
        $fileSize = $files['size'][$i];
        $fileError = $files['error'][$i];

        if ($fileError === UPLOAD_ERR_OK) {
            $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

            if (!in_array($fileExt, $allowedExtensions)) {
                $response['messages'][] = "Error ($fileName): Invalid extension.";
                $response['status'] = 'warning'; 
                continue;
            }

            if ($fileSize > $maxFileSize) {
                $response['messages'][] = "Error ($fileName): File too large (>100MB).";
                $response['status'] = 'warning';
                continue;
            }

            // Sanitize filename
            $safeName = preg_replace('/[^a-zA-Z0-9._-]/', '_', basename($fileName));
            
            // Avoid duplicates
            $targetPath = $uploadDir . $safeName;
            $counter = 1;
            $nameWithoutExt = pathinfo($safeName, PATHINFO_FILENAME);
            
            while (file_exists($targetPath)) {
                $safeName = $nameWithoutExt . '_' . $counter . '.' . $fileExt;
                $targetPath = $uploadDir . $safeName;
                $counter++;
            }

            if (move_uploaded_file($fileTmp, $targetPath)) {
                $response['messages'][] = "Success: $safeName uploaded.";
            } else {
                $response['messages'][] = "Error ($fileName): Failed to move file.";
                $response['status'] = 'warning';
            }

        } else {
            $response['messages'][] = "Error ($fileName): Upload code $fileError.";
            $response['status'] = 'warning';
        }
    }
} else {
    $response['status'] = 'error';
    $response['messages'][] = 'No files received.';
}

echo json_encode($response);
?>