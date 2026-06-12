param (
    [string]$BackupFile
)

if (-not $BackupFile) {
    Write-Host "Використання:"
    Write-Host ".\restore-db.ps1 src/database/backups/backup.sql"
    exit 1
}

if (!(Test-Path $BackupFile)) {
    Write-Host "Файл не знайдено: $BackupFile"
    exit 1
}

$env:PGPASSWORD = $env:DB_PASSWORD

psql `
  -h $env:DB_HOST `
  -p $env:DB_PORT `
  -U $env:DB_USERNAME `
  -d $env:DB_NAME `
  -f $BackupFile

Write-Host "Базу даних успішно відновлено."