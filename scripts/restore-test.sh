#!/usr/bin/env bash
# Teste la restauration d'un dump dans une base TEMPORAIRE (sans toucher
# à la base de production) puis vérifie que les données sont présentes.
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
DB_SERVICE="${DB_SERVICE:-db}"
POSTGRES_USER="${POSTGRES_USER:-shoplite}"
TMP_DB="${TMP_DB:-shoplite_restore_test}"

# Dump à restaurer : argument explicite, sinon le plus récent.
DUMP="${1:-$(ls -1t "$BACKUP_DIR"/backup-*.sql 2>/dev/null | head -1 || true)}"
if [ -z "$DUMP" ] || [ ! -f "$DUMP" ]; then
  echo "[restore-test] aucun dump trouvé dans $BACKUP_DIR (lancez d'abord backup.sh)" >&2
  exit 1
fi

echo "[restore-test] base temporaire '${TMP_DB}' à partir de ${DUMP}"
docker compose exec -T "$DB_SERVICE" psql -U "$POSTGRES_USER" -c "DROP DATABASE IF EXISTS ${TMP_DB};"
docker compose exec -T "$DB_SERVICE" psql -U "$POSTGRES_USER" -c "CREATE DATABASE ${TMP_DB};"
docker compose exec -T "$DB_SERVICE" psql -U "$POSTGRES_USER" -d "$TMP_DB" < "$DUMP"

COUNT="$(docker compose exec -T "$DB_SERVICE" \
  psql -U "$POSTGRES_USER" -d "$TMP_DB" -tAc "SELECT count(*) FROM products;")"
echo "[restore-test] produits restaurés : ${COUNT}"

docker compose exec -T "$DB_SERVICE" psql -U "$POSTGRES_USER" -c "DROP DATABASE ${TMP_DB};"
echo "[restore-test] OK — base temporaire supprimée, production intacte."
