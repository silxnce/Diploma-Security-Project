#!/bin/bash

if [ -z "$1" ]; then
  echo "Використання:"
  echo "./restore-db.sh backup.sql"
  exit 1
fi

psql \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USERNAME}" \
  -d "${DB_NAME}" \
  < "$1"

echo "Базу даних успішно відновлено."