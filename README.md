# 🎬 LocalDiapo

<p align="center">
  <img src="assets/logo.png" alt="LocalDiapo Logo" width="200"/>
</p>

<p align="center">
  <strong>Application web moderne de gestion et diffusion de diaporamas multimédias</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
</p>

---

## 📋 Description

**LocalDiapo** est une application web légère et élégante permettant de créer, gérer et diffuser des diaporamas multimédias en local. Idéale pour les présentations, affichages dynamiques ou tout environnement nécessitant une diffusion continue de contenus visuels.

### ✨ Caractéristiques principales

- 🎥 **Support multimédia complet** : Images (JPG, PNG, GIF, WebP) et vidéos (MP4, WebM, MOV)
- 🔄 **Lecture automatique** : Diaporama en boucle avec transitions fluides
- ⏱️ **Durée personnalisable** : Contrôle précis du temps d'affichage de chaque média
- 📤 **Upload par glisser-déposer** : Interface intuitive pour ajouter vos fichiers
- 🗂️ **Gestion complète** : Réorganisation, suppression et prévisualisation des médias
- 🔐 **Authentification sécurisée** : Protection CSRF et sessions sécurisées
- 📱 **Design responsive** : Interface adaptée à tous les écrans
- 🎨 **Interface moderne** : Design épuré avec animations fluides

---

## 🚀 Installation

### Prérequis

- **PHP** 7.4 ou supérieur
- **Serveur web** (Apache, Nginx, ou serveur PHP intégré)
- **Extensions PHP** : `fileinfo`, `session`

### Installation rapide

1. **Cloner le repository**
   ```bash
   git clone https://github.com/naoufalnajim01/LocalDiapo.git
   cd LocalDiapo
   ```

2. **Créer le dossier média**
   ```bash
   mkdir -p media
   chmod 755 media
   ```

3. **Lancer le serveur**
   
   **Option A : Serveur PHP intégré** (développement)
   ```bash
   php -S localhost:8000
   ```
   
   **Option B : Apache/Nginx** (production)
   - Placer les fichiers dans votre répertoire web (`/var/www/html`, `htdocs`, etc.)
   - Configurer un virtual host pointant vers le dossier du projet
   - S'assurer que le module `mod_rewrite` est activé (Apache)

4. **Accéder à l'application**
   - Ouvrir votre navigateur : `http://localhost:8000`
   - Se connecter avec les identifiants par défaut :
     - **Utilisateur** : `admin`
     - **Mot de passe** : `admin`

---

## 🔧 Configuration

### Modifier les identifiants de connexion

Pour des raisons de sécurité, il est **fortement recommandé** de changer le mot de passe par défaut.

1. Ouvrir le fichier `auth.php`
2. Générer un nouveau hash de mot de passe :
   ```php
   <?php
   echo password_hash('votre_nouveau_mot_de_passe', PASSWORD_DEFAULT);
   ?>
   ```
3. Remplacer la valeur de `ADMIN_PASSWORD_HASH` dans `auth.php`

### Permissions des dossiers

Assurez-vous que le dossier `media/` est accessible en écriture :

```bash
chmod 755 media
```

---

## 📖 Utilisation

### 1. Connexion
- Accéder à la page de connexion
- Entrer vos identifiants (admin/admin par défaut)

### 2. Gestion des médias
- **Ajouter des fichiers** : Glisser-déposer ou cliquer sur la zone d'upload
- **Réorganiser** : Glisser-déposer les vignettes pour changer l'ordre
- **Supprimer** : Cliquer sur l'icône de suppression sur chaque média
- **Configurer la durée** : Ajuster le temps d'affichage (5-60 secondes)

### 3. Lancement du diaporama
- Cliquer sur le bouton **"Lancer le diaporama"**
- Le diaporama démarre en plein écran
- Appuyer sur `Échap` pour quitter

### 4. Raccourcis clavier
- `Échap` : Quitter le diaporama
- `Espace` : Pause/Lecture (si implémenté)

---

## 🛠️ Structure du projet

```
LocalDiapo/
├── assets/
│   ├── favicon.ico          # Icône de l'application
│   └── logo.png             # Logo LocalDiapo
├── media/                   # Dossier de stockage des médias (créé automatiquement)
├── auth.php                 # Gestion de l'authentification et sécurité
├── delete.php               # Suppression de médias
├── index.php                # Page principale de gestion
├── list_videos.php          # Liste des médias disponibles
├── login.php                # Page de connexion
├── logout.php               # Déconnexion
├── upload_handler.php       # Gestion des uploads
├── script.js                # Logique JavaScript (diaporama, drag & drop)
├── style.css                # Styles de l'application
├── LICENSE                  # Licence MIT
└── README.md                # Documentation
```

---

## 🔒 Sécurité

LocalDiapo intègre plusieurs mécanismes de sécurité :

- ✅ **Protection CSRF** : Tokens de sécurité pour toutes les requêtes sensibles
- ✅ **Hachage de mots de passe** : Utilisation de `password_hash()` avec bcrypt
- ✅ **Validation des fichiers** : Vérification des types MIME et extensions
- ✅ **Sessions sécurisées** : Gestion appropriée des sessions PHP
- ✅ **Échappement des sorties** : Protection contre les injections XSS

### ⚠️ Recommandations de sécurité

1. **Changer le mot de passe par défaut** immédiatement après installation
2. **Utiliser HTTPS** en production
3. **Limiter l'accès** au dossier `media/` si nécessaire
4. **Mettre à jour PHP** régulièrement

---

## 🎨 Personnalisation

### Modifier les couleurs

Éditer les variables CSS dans `style.css` :

```css
:root {
    --primary: #1a5fb4;
    --primary-dark: #134a8f;
    --bg: #f6f8fa;
    /* ... autres variables */
}
```

### Ajouter des formats de fichiers

Modifier les tableaux de validation dans `upload_handler.php` :

```php
$allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov'];
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. **Créer une branche** pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir une Pull Request**

---

## 📝 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👤 Auteur

**Naoufal Najim**

- 🌐 GitHub: [@naoufalnajim01](https://github.com/naoufalnajim01)
- 💼 LinkedIn: [Naoufal Najim](https://www.linkedin.com/in/naoufalnajim01/)
- 📧 Email: naoufal.najim19@gmail.com
- 🐦 X/Twitter: [@naoufalnajim01](https://x.com/naoufalnajim01)

---

## 🙏 Remerciements

- Icônes par [Font Awesome](https://fontawesome.com/)
- Inspiration design moderne et épuré

---

## 📊 Statistiques du projet

<p align="center">
  <img src="https://img.shields.io/github/stars/naoufalnajim01/LocalDiapo?style=social" alt="Stars"/>
  <img src="https://img.shields.io/github/forks/naoufalnajim01/LocalDiapo?style=social" alt="Forks"/>
  <img src="https://img.shields.io/github/issues/naoufalnajim01/LocalDiapo" alt="Issues"/>
  <img src="https://img.shields.io/github/license/naoufalnajim01/LocalDiapo" alt="License"/>
</p>

---

<p align="center">
  <i>⭐ Si ce projet vous a été utile, n'hésitez pas à lui donner une étoile !</i>
</p>
