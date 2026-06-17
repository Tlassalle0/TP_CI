# Rapport d'incident — ShopLite

## Template

> **Impact** — qui/quoi est touché, depuis quand.
> **Timeline** — horodatage des actions.
> **Diagnostic** — cause racine.
> **Correction** — action de remédiation.
> **Prévention** — comment éviter la récidive.

---

## Incident #1 — `/api/products` renvoie 500 (v1.1.0)

### Impact

- **Service** : route `GET /api/products` indisponible (HTTP 500).
- **Utilisateur** : le catalogue ne s'affiche plus sur le frontend.
- **Périmètre** : version `v1.1.0` déployée en staging. Données **non** affectées.
- **Gravité** : majeure (fonction cœur du produit), mais réversible.

### Timeline

| Heure | Action                                   | Responsable          | Résultat                        |
| ----- | ---------------------------------------- | -------------------- | ------------------------------- |
| 10:05 | Détection : test `/api/products` rouge   | QA                   | Test en échec                   |
| 10:08 | Analyse des logs API                     | DevOps + Dév API     | Erreur SQL : colonne inexistante|
| 10:12 | Vérification PostgreSQL                  | DBA                  | Données présentes et intactes   |
| 10:13 | Sauvegarde préventive (`backup.sh`)      | DBA                  | Dump horodaté créé              |
| 10:15 | Décision de rollback                     | PO + Incident Manager| Rollback validé                 |
| 10:18 | `git revert` + `rollback.sh v1.0.0`      | DevOps               | API redémarrée en v1.0.0        |
| 10:22 | Smoke test + tests automatisés           | QA                   | Tests verts                     |
| 10:25 | Communication finale                     | Incident Manager     | Incident clos                   |

### Diagnostic (cause racine)

La v1.1.0 a introduit dans `api/src/routes/products.js` une requête SQL
sélectionnant une colonne **inexistante** (`stock`), provoquant une exception
relayée en HTTP 500. La base de données n'était pas en cause.

Commandes de diagnostic utilisées :

```bash
docker compose ps
docker compose logs --tail=100 api
curl -i http://localhost:8080/api/products
docker inspect shoplite_api
```

### Correction

1. `./scripts/backup.sh` (filet de sécurité).
2. `git revert <sha-incident>` pour tracer l'annulation dans l'historique.
3. `./scripts/rollback.sh v1.0.0` — redéploiement de la version stable **sans** suppression du volume.
4. Vérification : `./scripts/smoke-test.sh` + `npm test` (test `/api/products` repassé au vert).
5. Contrôle des données : `SELECT count(*) FROM products;` → inchangé.

### Traçabilité Git (SHAs réels)

| Étape                | Commit    | Description                                              |
| -------------------- | --------- | ------------------------------------------------------- |
| Incident introduit   | `64c51c5` | `feat(products): low_stock (v1.1.0 candidate)` (bug)    |
| Annulation (revert)  | `5120a3d` | `Revert "feat(products)…"` → test repassé au vert       |
| Hotfix correctif     | `e7440c2` | `fix(products): stock null-safe + migration…` (v1.1.0)  |
| Versions stables     | tags      | `v1.0.0` (pré-incident), `v1.1.0` (post-hotfix)         |

### Prévention

- Test d'intégration `/api/products` **bloquant** en CI (matrice + PostgreSQL réel).
- Revue de code obligatoire sur les changements SQL.
- Tag de version stable systématique avant déploiement (`v1.0.0`) pour un rollback immédiat.

### Mini-communication incident

> **[RÉSOLU] Catalogue ShopLite indisponible (~20 min).**
> Impact : affichage du catalogue. Cause : régression SQL en v1.1.0.
> Action : rollback vers v1.0.0, aucune perte de données. Statut : service rétabli, surveillance en cours.

---

## Checklist sécurité (relue lors de l'incident)

- [x] Aucun secret réel dans Git / Dockerfile / image / logs
- [x] `.env` ignoré, seul `.env.example` commité
- [x] Ports exposés limités au strict nécessaire (8080 via proxy)
- [x] Dépendances auditées (`npm audit`) et image scannée (Trivy)
- [x] Logs masquant tokens / mots de passe / chaînes de connexion

### Classement des risques

| Risque                              | Niveau   |
| ----------------------------------- | -------- |
| Régression SQL non testée           | Critique |
| Dépendances obsolètes non suivies   | Moyen    |
| Absence de validation manuelle prod | Moyen    |
| Logs verbeux en production          | Faible   |
