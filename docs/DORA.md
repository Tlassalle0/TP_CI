# Indicateurs DORA — ShopLite

Les 4 indicateurs DORA (DevOps Research and Assessment) mesurent la performance
de livraison logicielle. Valeurs ci-dessous estimées sur le périmètre du TP.

| Indicateur                | Définition                                              | Mesure ShopLite                          | Source                         |
| ------------------------- | ------------------------------------------------------- | ---------------------------------------- | ------------------------------ |
| **Deployment Frequency**  | Fréquence des déploiements en production                | À chaque tag `v*` (≈ plusieurs/semaine)  | Tags Git + runs CD             |
| **Lead Time for Changes** | Délai entre commit et mise en production                | < 1 h (CI ~5 min + validation manuelle)  | Horodatage commit → run CD     |
| **Change Failure Rate**   | % de déploiements provoquant un incident                | 1 incident sur N déploiements (v1.1.0)   | `docs/INCIDENT.md`             |
| **MTTR**                  | Temps moyen de rétablissement après incident            | ~20 min (rollback v1.0.0)                | Timeline incident              |

## Comment ces métriques sont obtenues

- **Deployment Frequency** : nombre de tags `v*` poussés / période (`git tag --sort=creatordate`).
- **Lead Time** : différence entre la date du commit mergé et la date du run CD réussi.
- **Change Failure Rate** : `déploiements en échec / déploiements totaux`. Ici la v1.1.0 a
  introduit une régression (1 échec), corrigée par rollback.
- **MTTR** : durée entre la détection (10:05) et la résolution (10:25) dans `docs/INCIDENT.md` → ~20 min.

## Pistes d'amélioration

- Automatiser le smoke test post-déploiement pour réduire le temps de détection.
- Déploiements plus petits et plus fréquents pour baisser le lead time et le risque.
- Alerting sur `/health` et `/ready` pour détecter avant le signalement client.
