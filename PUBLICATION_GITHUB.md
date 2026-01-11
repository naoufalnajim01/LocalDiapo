# 📦 Guide de Publication sur GitHub

Ce guide vous explique comment publier **LocalDiapo** sur votre compte GitHub.

---

## ✅ Prérequis

Avant de commencer, assurez-vous d'avoir :

- [x] Un compte GitHub ([créer un compte](https://github.com/signup))
- [x] Git installé sur votre machine ([télécharger Git](https://git-scm.com/downloads))
- [x] Les identifiants modifiés (admin/admin) ✓
- [x] Les fichiers GitHub créés (README, LICENSE, etc.) ✓

---

## 🚀 Étapes de publication

### 1. Initialiser le dépôt Git local

Ouvrir un terminal dans le dossier du projet et exécuter :

```bash
cd c:\Users\najim\Desktop\diaporama
git init
```

### 2. Ajouter tous les fichiers

```bash
git add .
```

### 3. Créer le premier commit

```bash
git commit -m "feat: initial commit - LocalDiapo v1.0.0"
```

### 4. Créer un nouveau repository sur GitHub

1. Aller sur [GitHub](https://github.com)
2. Cliquer sur le bouton **"+"** en haut à droite
3. Sélectionner **"New repository"**
4. Remplir les informations :
   - **Repository name** : `LocalDiapo`
   - **Description** : `Application web moderne de gestion et diffusion de diaporamas multimédias`
   - **Visibilité** : Public
   - **NE PAS** cocher "Initialize with README" (on a déjà un README)
5. Cliquer sur **"Create repository"**

### 5. Lier le dépôt local au dépôt distant

Remplacer `naoufalnajim01` par votre nom d'utilisateur GitHub :

```bash
git remote add origin https://github.com/naoufalnajim01/LocalDiapo.git
git branch -M main
```

### 6. Pousser le code sur GitHub

```bash
git push -u origin main
```

Si demandé, entrer vos identifiants GitHub ou utiliser un Personal Access Token.

---

## 🔑 Créer un Personal Access Token (si nécessaire)

Si GitHub demande un token au lieu d'un mot de passe :

1. Aller sur **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Cliquer sur **"Generate new token"** → **"Generate new token (classic)"**
3. Donner un nom : `LocalDiapo Push`
4. Cocher les permissions : `repo` (toutes les sous-options)
5. Cliquer sur **"Generate token"**
6. **COPIER LE TOKEN** (il ne sera affiché qu'une fois)
7. Utiliser ce token comme mot de passe lors du push

---

## 📝 Commandes Git utiles

### Vérifier le statut
```bash
git status
```

### Ajouter des modifications
```bash
git add .
git commit -m "fix: correction d'un bug"
git push
```

### Créer une nouvelle branche
```bash
git checkout -b feature/nouvelle-fonctionnalite
```

### Fusionner une branche
```bash
git checkout main
git merge feature/nouvelle-fonctionnalite
git push
```

---

## 🎨 Personnaliser le repository GitHub

### Ajouter des Topics

1. Aller sur votre repository GitHub
2. Cliquer sur l'icône ⚙️ à côté de "About"
3. Ajouter des topics : `php`, `javascript`, `slideshow`, `diaporama`, `web-app`, `multimedia`

### Activer GitHub Pages (optionnel)

Si vous voulez héberger une démo :

1. Aller dans **Settings** → **Pages**
2. Sélectionner la branche `main`
3. Cliquer sur **Save**

### Ajouter une description

Dans "About" :
- **Description** : `🎬 Application web moderne de gestion et diffusion de diaporamas multimédias`
- **Website** : Votre URL de démo si applicable

---

## 📊 Badges pour le README

Les badges dans le README s'afficheront automatiquement une fois le repository publié :

- ⭐ Stars
- 🍴 Forks
- 📝 License
- 🐛 Issues

---

## 🔄 Mises à jour futures

Pour publier des mises à jour :

```bash
# Modifier vos fichiers
git add .
git commit -m "feat: ajout d'une nouvelle fonctionnalité"
git push
```

---

## ✅ Checklist finale

Avant de publier, vérifier que :

- [ ] Le mot de passe est bien `admin/admin`
- [ ] Le dossier `media/` est vide (sauf `.gitkeep`)
- [ ] Tous les fichiers sont commités
- [ ] Le README est complet et à jour
- [ ] La LICENSE est présente
- [ ] Le `.gitignore` exclut les bons fichiers

---

## 🎉 Félicitations !

Votre projet **LocalDiapo** est maintenant publié sur GitHub ! 🚀

N'oubliez pas de :
- Partager le lien sur vos réseaux sociaux
- Ajouter le lien dans votre profil LinkedIn
- Mettre à jour votre portfolio

---

## 📞 Besoin d'aide ?

- [Documentation Git](https://git-scm.com/doc)
- [Documentation GitHub](https://docs.github.com)
- Email : naoufal.najim19@gmail.com

---

<p align="center">
  <i>Bon courage pour la publication ! 🚀</i>
</p>
