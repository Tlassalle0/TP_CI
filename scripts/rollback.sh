#!/usr/bin/env bash
# Rollback vers une version stable taguée, SANS perte de données PostgreSQL.
#
# Usage : ./scripts/rollback.sh <version>      ex: ./scripts/rollback.sh v1.0.0
#
# Règle d'or : on ne supprime JAMAIS les volumes (pas de `docker compose down -v`).
set -euo pipefail

VERSION="${1:-}"
if [ -z "$VERSION" ]; then
  echo "Usage: $0 <version>   (ex: v1.0.0)" >&2
  exit 1
fi

echo "==> [rollback] cible : ${VERSION}"

# 1. Vérifier que la version existe (tag git ou commit).
if ! git rev-parse --verify "$VERSION" >/dev/null 2>&1; then
  echo "[rollback] version '${VERSION}' introuvable dans Git (tags disponibles ci-dessous)" >&2
  git tag >&2
  exit 1
fi

# 2. Sauvegarder la base AVANT toute action (filet de sécurité).
echo "==> [rollback] sauvegarde préalable de la base"
./scripts/backup.sh

# 3. Revenir au code de la version stable.
echo "==> [rollback] git checkout ${VERSION}"
git checkout "$VERSION"

# 4. Reconstruire et relancer SANS supprimer les volumes (-v interdit).
echo "==> [rollback] redéploiement (les volumes/données sont conservés)"
APP_VERSION="$VERSION" docker compose up -d --build

# 5. Vérification post-rollback.
echo "==> [rollback] vérification (smoke test)"
sleep 5
./scripts/smoke-test.sh

echo "==> [rollback] terminé : application revenue à ${VERSION}, données conservées."
