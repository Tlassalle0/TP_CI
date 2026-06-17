# Description

Décrivez brièvement les modifications apportées et le contexte.

## Type de changement

- [ ] Correction de bug (`fix`)
- [ ] Nouvelle fonctionnalité (`feat`)
- [ ] Refactoring (`refactor`)
- [ ] Documentation (`docs`)
- [ ] Tests (`test`)
- [ ] CI/CD (`ci`)

## Checklist qualité

- [ ] La branche part de `develop` (ou `main` pour un `hotfix`)
- [ ] Les commits suivent la convention (`feat:`, `fix:`, `test:`, `docs:`, `ci:`...)
- [ ] `npm test` passe (couverture >= 80 %)
- [ ] `npm run lint` et `npm run format:check` passent
- [ ] `docker compose build` réussit
- [ ] Smoke test OK (`/health`, `/ready`, `/api/products`)
- [ ] La documentation a été mise à jour si nécessaire
- [ ] Aucun secret réel n'est commité

## Risques et plan de rollback

Décrivez l'impact potentiel et la procédure de retour arrière
(`scripts/rollback.sh <version>` ou `git revert <sha>`).

## Liens utiles

Issue associée : #
