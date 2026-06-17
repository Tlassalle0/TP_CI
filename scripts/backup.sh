#!/usr/bin/env bash
# Sauvegarde PostgreSQL via pg_dump dans un dossier monté sur l'hôte,
# avec horodatage et politique de rétention.
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION="${RETENTION:-7}"          # nombre de dumps à conserver
DB_SERVICE="${DB_SERVICE:-db}"
POSTGRES_USER="${POSTGRES_USER:-shoplite}"
POSTGRES_DB="${POSTGRES_DB:-shoplite}"

mkdir -p "$BACKUP_DIR"

TS="$(date +%Y%m%d-%H%M%S)"
FILE="$BACKUP_DIR/backup-${POSTGRES_DB}-${TS}.sql"

echo "[backup] dump de '${POSTGRES_DB}' -> ${FILE}"
docker compose exec -T "$DB_SERVICE" \
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" > "$FILE"

echo "[backup] taille : $(du -h "$FILE" | cut -f1)"

# Rétention : garder les RETENTION dumps les plus récents, supprimer le reste.
# shellcheck disable=SC2012
ls -1t "$BACKUP_DIR"/backup-*.sql 2>/dev/null | tail -n +"$((RETENTION + 1))" | while read -r old; do
  echo "[backup] suppression (rétention) : $old"
  rm -f "$old"
done

echo "[backup] terminé. Conservation : ${RETENTION} dumps max."
