<?php
// auth.php - Gestion de l'authentification et de la sécurité

session_start();

// Configuration de sécurité
define('ADMIN_USERNAME', 'admin');
// Mot de passe par défaut: 'admin'
// Généré avec password_hash('admin', PASSWORD_DEFAULT)
define('ADMIN_PASSWORD_HASH', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); // Hash pour 'admin'

// Fonction pour vérifier si l'utilisateur est connecté
function isAuthenticated() {
    return isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
}

// Fonction pour exiger l'authentification (redirige si non connecté)
function requireLogin() {
    if (!isAuthenticated()) {
        if (isAjaxRequest()) {
            header('HTTP/1.1 401 Unauthorized');
            echo json_encode(['status' => 'error', 'message' => 'Non autorisé. Veuillez vous connecter.']);
            exit;
        } else {
            header('Location: login.php');
            exit;
        }
    }
}

// Vérifier si c'est une requête AJAX
function isAjaxRequest() {
    return (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') 
           || (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false);
}

// Génération de token CSRF
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Vérification CSRF
function verifyCSRF($token) {
    if (!isset($_SESSION['csrf_token']) || $token !== $_SESSION['csrf_token']) {
        if (isAjaxRequest()) {
            header('HTTP/1.1 403 Forbidden');
            echo json_encode(['status' => 'error', 'message' => 'Erreur CSRF. Actualisez la page.']);
            exit;
        } else {
            die('Erreur de sécurité (CSRF). Veuillez actualiser la page.');
        }
    }
}
?>
