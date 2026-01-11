<?php
require_once 'auth.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    // Vérification basique
    if ($username === ADMIN_USERNAME && password_verify($password, ADMIN_PASSWORD_HASH)) {
        $_SESSION['logged_in'] = true;
        header('Location: index.php');
        exit;
    } else {
        $error = 'Identifiants incorrects.';
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion - LocalDiapo</title>
    <link rel="icon" type="image/x-icon" href="assets/favicon.ico">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <style>
        :root {
            --primary: #1a5fb4;
            --primary-dark: #134a8f;
            --primary-soft: #dce9f7;
            --bg: #f6f8fa;
            --surface: #ffffff;
            --txt: #1f2328;
            --txt-soft: #57606a;
            --border: #d0d7de;
            --err: #cf222e;
            --shadow: 0 8px 24px rgba(140, 149, 159, 0.2);
            --font: 'Trebuchet MS', 'Lucida Grande', Arial, sans-serif;
        }

        body {
            font-family: var(--font);
            background: var(--bg);
            background-image: radial-gradient(#e1e4e8 1px, transparent 1px);
            background-size: 20px 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            color: var(--txt);
        }

        .login-wrapper {
            width: 100%;
            max-width: 400px;
            padding: 20px;
            animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .login-card {
            background: var(--surface);
            padding: 40px;
            border-radius: 12px;
            box-shadow: var(--shadow);
            border: 1px solid var(--border);
            position: relative;
            overflow: hidden;
        }

        .login-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), #3b82f6);
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .header h1 {
            color: var(--primary);
            font-size: 1.8rem;
            margin: 0 0 8px 0;
            letter-spacing: -0.5px;
        }

        .header p {
            color: var(--txt-soft);
            font-size: 0.95rem;
            margin: 0;
        }

        .form-group {
            margin-bottom: 20px;
            position: relative;
        }

        .form-label {
            display: block;
            margin-bottom: 8px;
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--txt);
            transition: color 0.2s;
        }

        .input-group {
            position: relative;
        }

        .input-group i {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--txt-soft);
            font-size: 1rem;
            transition: color 0.2s;
        }

        .form-control {
            width: 100%;
            padding: 12px 12px 12px 42px;
            border: 1px solid var(--border);
            border-radius: 6px;
            font-size: 0.95rem;
            transition: all 0.2s;
            box-sizing: border-box;
            background: var(--bg);
        }

        .form-control:focus {
            outline: none;
            border-color: var(--primary);
            background: #fff;
            box-shadow: 0 0 0 3px var(--primary-soft);
        }

        .form-control:focus + i {
            color: var(--primary);
        }

        .btn-login {
            width: 100%;
            padding: 12px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            margin-top: 10px;
        }

        .btn-login:hover {
            background: var(--primary-dark);
            transform: translateY(-1px);
        }

        .btn-login:active {
            transform: translateY(0);
        }

        .error-alert {
            background: rgba(207, 34, 46, 0.1);
            color: var(--err);
            padding: 12px;
            border-radius: 6px;
            font-size: 0.9rem;
            margin-bottom: 20px;
            border: 1px solid rgba(207, 34, 46, 0.2);
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            animation: shake 0.4s ease-in-out;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        .footer-copyright {
            margin-top: 30px;
            text-align: center;
            font-size: 0.85rem;
            color: var(--txt-soft);
            opacity: 0.8;
        }

        .footer-copyright strong {
            color: var(--primary);
        }
    </style>
</head>
<body>
    <div class="login-wrapper">
        <div class="login-card">
            <div class="header">
                <img src="assets/logo.png" alt="LocalDiapo Logo" style="height: 60px; margin-bottom: 10px;">
                <h1>LocalDiapo</h1>
                <p>Veuillez vous identifier</p>
            </div>

            <?php if ($error): ?>
                <div class="error-alert">
                    <i class="fas fa-circle-exclamation"></i>
                    <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <form method="POST" action="">
                <div class="form-group">
                    <label for="username" class="form-label">Utilisateur</label>
                    <div class="input-group">
                        <input type="text" id="username" name="username" class="form-control" placeholder="Entrez votre identifiant" required autofocus>
                        <i class="fas fa-user"></i>
                    </div>
                </div>

                <div class="form-group">
                    <label for="password" class="form-label">Mot de passe</label>
                    <div class="input-group">
                        <input type="password" id="password" name="password" class="form-control" placeholder="Entrez votre mot de passe" required>
                        <i class="fas fa-lock"></i>
                    </div>
                </div>

                <button type="submit" class="btn-login">
                    Se connecter <i class="fas fa-arrow-right"></i>
                </button>
            </form>
        </div>

        <div class="footer-copyright">
            © Tous droits réservés, 2026 - <strong>LocalDiapo</strong>
        </div>
    </div>
</body>
</html>
