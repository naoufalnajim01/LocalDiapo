# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer à **LocalDiapo** ! Voici comment vous pouvez participer à l'amélioration du projet.

---

## 📋 Comment contribuer

### 1. Signaler un bug

Si vous trouvez un bug, veuillez :

1. Vérifier qu'il n'a pas déjà été signalé dans les [Issues](https://github.com/naoufalnajim01/LocalDiapo/issues)
2. Créer une nouvelle issue avec :
   - Un titre clair et descriptif
   - Les étapes pour reproduire le bug
   - Le comportement attendu vs le comportement observé
   - Des captures d'écran si pertinent
   - Votre environnement (OS, version PHP, navigateur)

### 2. Proposer une nouvelle fonctionnalité

Pour proposer une amélioration :

1. Ouvrir une issue avec le tag `enhancement`
2. Décrire clairement la fonctionnalité souhaitée
3. Expliquer pourquoi elle serait utile
4. Proposer une implémentation si possible

### 3. Soumettre une Pull Request

#### Étapes à suivre

1. **Fork** le repository
2. **Cloner** votre fork localement
   ```bash
   git clone https://github.com/votre-username/LocalDiapo.git
   cd LocalDiapo
   ```

3. **Créer une branche** pour votre fonctionnalité
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```

4. **Développer** votre fonctionnalité
   - Suivre les conventions de code du projet
   - Commenter votre code si nécessaire
   - Tester vos modifications

5. **Commit** vos changements
   ```bash
   git add .
   git commit -m "feat: ajout de ma nouvelle fonctionnalité"
   ```

6. **Push** vers votre fork
   ```bash
   git push origin feature/ma-nouvelle-fonctionnalite
   ```

7. **Créer une Pull Request** depuis GitHub
   - Décrire clairement vos modifications
   - Référencer les issues liées si applicable

---

## 📝 Conventions de code

### PHP

- Utiliser PSR-12 pour le style de code
- Indentation : 4 espaces
- Toujours échapper les sorties avec `htmlspecialchars()`
- Utiliser des noms de variables descriptifs

```php
// ✅ Bon
$userMediaList = getUserMediaFiles();

// ❌ Mauvais
$uml = getFiles();
```

### JavaScript

- Utiliser des noms de variables en camelCase
- Préférer `const` et `let` à `var`
- Commenter les fonctions complexes

```javascript
// ✅ Bon
const mediaContainer = document.getElementById('media-container');

// ❌ Mauvais
var mc = document.getElementById('media-container');
```

### CSS

- Utiliser des variables CSS pour les couleurs
- Nommer les classes de manière descriptive
- Organiser les propriétés par ordre logique

---

## 🧪 Tests

Avant de soumettre une PR, assurez-vous que :

- [ ] Le code fonctionne sans erreur PHP
- [ ] L'interface est responsive
- [ ] Les fonctionnalités existantes ne sont pas cassées
- [ ] Le code est compatible avec PHP 7.4+

---

## 📜 Messages de commit

Utiliser le format [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Modification de documentation
- `style:` Changements de style (formatage, etc.)
- `refactor:` Refactorisation du code
- `perf:` Amélioration des performances
- `test:` Ajout ou modification de tests
- `chore:` Tâches de maintenance

**Exemples :**
```
feat: ajout du support des fichiers SVG
fix: correction du bug de suppression multiple
docs: mise à jour du README avec nouvelles instructions
```

---

## ❓ Questions

Si vous avez des questions, n'hésitez pas à :

- Ouvrir une [Discussion](https://github.com/naoufalnajim01/LocalDiapo/discussions)
- Me contacter par email : naoufal.najim19@gmail.com

---

## 🙏 Merci !

Chaque contribution, petite ou grande, est appréciée. Merci de prendre le temps d'améliorer LocalDiapo !

---

<p align="center">
  <i>Fait avec ❤️ par la communauté</i>
</p>
