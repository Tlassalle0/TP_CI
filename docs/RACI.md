# Matrice RACI — ShopLite (incident & rollback v1.1.0)

**R**esponsible (réalise) · **A**ccountable (rend des comptes / valide) ·
**C**onsulted (consulté) · **I**nformed (informé).

## Rôles

| Rôle                       | Responsabilité principale                                  |
| -------------------------- | ---------------------------------------------------------- |
| PO (Product Owner)         | Priorise l'impact métier, valide le service rendu          |
| API (Dév backend)          | Analyse / corrige / revert la route cassée                 |
| Frontend (Dév front)       | Vérifie l'affichage du catalogue, confirme l'impact        |
| DevOps / Release Manager   | CI/CD, Docker, tags, déploiement, rollback, smoke tests    |
| DBA / Référent données     | Sauvegarde PostgreSQL, vérifie l'intégrité des données     |
| QA / Testeur               | Exécute les tests (rouge pendant, vert après rollback)     |
| IM (Incident Manager)      | Coordonne la communication et la timeline                  |

## Matrice

| Activité                                | PO | API | Frontend | DevOps | DBA | QA | IM |
| --------------------------------------- | -- | --- | -------- | ------ | --- | -- | -- |
| Créer la version stable Git             | A  | R   | C        | R      | I   | C  | I  |
| Mettre en place Docker Compose          | I  | C   | I        | R/A    | C   | I  | I  |
| Configurer la CI/CD                     | I  | C   | I        | R/A    | I   | C  | I  |
| Ajouter le test `/api/products`         | I  | C   | I        | C      | I   | R/A| I  |
| Sauvegarder PostgreSQL                  | I  | I   | I        | C      | R/A | I  | I  |
| Provoquer l'incident contrôlé           | I  | R   | I        | C      | I   | C  | A  |
| Diagnostiquer l'incident                | I  | R   | C        | R      | C   | C  | A  |
| Décider le rollback                     | A  | C   | I        | C      | C   | I  | R  |
| Exécuter le rollback                    | I  | C   | I        | R/A    | C   | I  | I  |
| Vérifier les données après rollback     | I  | I   | I        | C      | R/A | C  | I  |
| Valider les tests après rollback        | I  | C   | C        | C      | I   | R/A| I  |
| Rédiger le rapport d'incident           | C  | C   | I        | C      | C   | C  | R/A|

## Qui a fait quoi pendant le TP

> Équipe de 2 personnes : chacun cumule plusieurs rôles.
> Adapter ci-dessous selon le binôme réel.

| Personne     | Rôles cumulés                          |
| ------------ | -------------------------------------- |
| Tlassalle0   | DevOps / Release Manager, API, IM      |
| Talienhyung  | QA, DBA, PO, Frontend                  |

La timeline détaillée de l'incident est dans [`INCIDENT.md`](INCIDENT.md).
