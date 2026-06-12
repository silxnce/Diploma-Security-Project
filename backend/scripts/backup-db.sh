#!/bin/bash

BACKUP_DIR="./src/database/backups"

mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

pg_dump \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USERNAME}" \
  -d "${DB_NAME}" \
  > "${BACKUP_DIR}/backup_${TIMESTAMP}.sql"

echo "Резервна копія створена:"
echo "${BACKUP_DIR}/backup_${TIMESTAMP}.sql"