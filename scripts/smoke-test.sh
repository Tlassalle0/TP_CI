#!/usr/bin/env bash
# Smoke test post-déploiement : vérifie /health, /ready et /api/products.
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8080}"

echo "[smoke] BASE_URL=${BASE_URL}"

echo "[smoke] GET /api/health"
curl -fsS "$BASE_URL/api/health" | grep -q '"status":"ok"'

echo "[smoke] GET /api/ready"
curl -fsS "$BASE_URL/api/ready" | grep -q '"ready":true'

echo "[smoke] GET /api/products"
BODY="$(curl -fsS "$BASE_URL/api/products")"
echo "$BODY" | grep -q '"data"'

# Le catalogue ne doit pas être vide après un déploiement réussi.
if echo "$BODY" | grep -q '"data":\[\]'; then
  echo "[smoke] ÉCHEC : catalogue vide" >&2
  exit 1
fi

echo "[smoke] OK — health, ready et products répondent correctement."
