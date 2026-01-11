# 🔒 Politique de Sécurité

## Versions supportées

Nous prenons la sécurité de LocalDiapo très au sérieux. Voici les versions actuellement supportées avec des mises à jour de sécurité :

| Version | Supportée          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

---

## 🛡️ Signaler une vulnérabilité

Si vous découvrez une vulnérabilité de sécurité dans LocalDiapo, merci de **NE PAS** créer une issue publique.

### Processus de signalement

1. **Envoyer un email** à : naoufal.najim19@gmail.com
2. **Inclure dans votre rapport** :
   - Description détaillée de la vulnérabilité
   - Étapes pour reproduire le problème
   - Impact potentiel
   - Suggestions de correction si possible

3. **Attendre une réponse** sous 48 heures
4. **Collaboration** pour résoudre le problème avant toute divulgation publique

---

## 🔐 Bonnes pratiques de sécurité

### Pour les utilisateurs

1. **Changer le mot de passe par défaut** immédiatement après installation
2. **Utiliser HTTPS** en production
3. **Mettre à jour PHP** régulièrement (minimum PHP 7.4)
4. **Limiter les permissions** du dossier `media/` (755 recommandé)
5. **Sauvegarder régulièrement** vos données

### Pour les développeurs

1. **Toujours échapper les sorties** avec `htmlspecialchars()`
2. **Valider les entrées utilisateur** côté serveur
3. **Utiliser les tokens CSRF** pour les actions sensibles
4. **Ne jamais stocker de mots de passe en clair**
5. **Suivre les principes OWASP**

---

## 🚨 Vulnérabilités connues

Aucune vulnérabilité connue à ce jour.

---

## 📜 Historique des correctifs de sécurité

### Version 1.0.0 (2026-01-11)
- Implémentation initiale avec :
  - Protection CSRF
  - Hachage de mots de passe (bcrypt)
  - Validation des types de fichiers
  - Sessions sécurisées

---

## 🙏 Remerciements

Nous remercions tous les chercheurs en sécurité qui contribuent à rendre LocalDiapo plus sûr.

---

<p align="center">
  <i>La sécurité est une responsabilité partagée. Merci de votre vigilance !</i>
</p>
