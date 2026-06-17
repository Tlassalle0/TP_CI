# Changelog

Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/) — versionnement
[SemVer](https://semver.org/lang/fr/).

## [Non publié]

## [1.0.0]

Première version industrialisée et stable de ShopLite.

### Ajouté

- Stratégie Git (branches `master`/`develop`/`feature/*`), template de PR, `CONTRIBUTING.md`.
- Dockerfiles API et frontend (image figée, non-root, healthcheck, multi-fichiers `.dockerignore`).
- `docker-compose.yml` : rotation des logs, limites CPU/mémoire, `depends_on: service_healthy`,
  healthcheck `/ready`, `env_file`, volume nommé. Override `docker-compose.staging.yml`.
- Observabilité : `/health` détaillé (version, uptime), `/ready`, logs JSON avec `request_id`,
  niveaux `debug`→`fatal`, masquage des secrets.
- Tests Jest (unitaires + intégration PostgreSQL en CI), couverture ≥ 80 %, ESLint + Prettier.
- CI GitHub Actions : lint, tests (matrice Node 18/20 + service PostgreSQL, cache npm,
  artefact de couverture), build Docker, scan Trivy, `npm audit`.
- CD : `develop` → staging, tag `v*` → production (validation manuelle).
- Scripts `backup.sh`, `restore-test.sh`, `rollback.sh`, `smoke-test.sh`.
- Documentation : README + badges, `docs/ARCHITECTURE.md`, `docs/INCIDENT.md`,
  `docs/DORA.md`, `docs/RACI.md`.

[Non publié]: https://github.com/Tlassalle0/TP_CI/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Tlassalle0/TP_CI/releases/tag/v1.0.0
