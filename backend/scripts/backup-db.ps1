$BackupDir = "src/database/backups"

if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = "$BackupDir/backup_$Timestamp.sql"

$env:PGPASSWORD = $env:DB_PASSWORD

pg_dump `
  -h $env:DB_HOST `
  -p $env:DB_PORT `
  -U $env:DB_USERNAME `
  -d $env:DB_NAME `
  -f $BackupFile

Write-Host "Резервна копія створена:"
Write-Host $BackupFile