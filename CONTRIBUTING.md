# Contribution — ShopLite

Ce document décrit la stratégie Git et les règles de collaboration du projet.

## Stratégie de branches (Git Flow simplifié)

| Branche        | Rôle                                                        |
| -------------- | ----------------------------------------------------------- |
| `master`       | Production. Protégée, ne reçoit que des merges via PR.      |
| `develop`      | Intégration continue des fonctionnalités. Cible du staging. |
| `feature/*`    | Une fonctionnalité = une branche, partant de `develop`.     |
| `hotfix/*`     | Correctif urgent partant de `master`, mergé sur `master` ET `develop`. |

```text
master  ───●───────────────●──────────●  (v1.0.0, v1.1.0, tags)
            \             /            ^
develop  ────●───●───●───●────●────────┘
              \   \   \        \
feature/...    ●   ●   ●        ● hotfix/...
```

## Convention de commits

On utilise les **Conventional Commits** :

- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `test:` ajout / modification de tests
- `docs:` documentation
- `ci:` intégration / déploiement continu
- `chore:` tâches diverses (config, build)
- `refactor:` refactoring sans changement de comportement

Exemple : `feat(api): ajoute la route /ready de readiness`

## Pull Requests

1. Créer une branche `feature/<sujet>` depuis `develop`.
2. Commits fréquents et atomiques.
3. Ouvrir une PR en remplissant le template (`.github/pull_request_template.md`).
4. La CI doit être **verte** (tests, lint, build).
5. Au moins **une review** d'un binôme avant le merge.
6. Merge dans `develop` (puis `develop` → `master` pour une release).

## Protection de branche (GitHub)

À configurer dans `Settings > Branches` sur GitHub pour `master` et `develop` :

- Require a pull request before merging
- Require status checks to pass (CI)
- Require at least 1 approval

## Versionnement

Versionnement sémantique (SemVer) : `MAJOR.MINOR.PATCH`, taggé sur `master`
(`git tag v1.0.0`). Voir [`CHANGELOG.md`](CHANGELOG.md).
