# Dump schema public (read-only) từ Supabase -> schema.sql
# Chạy: pwsh scripts/dump-schema.ps1   (hoặc trong PowerShell tại thư mục dự án)
$ErrorActionPreference = 'Stop'

$root    = Split-Path $PSScriptRoot -Parent
$envFile = Join-Path $root '.env'
if (-not (Test-Path $envFile)) {
  Write-Error ".env không có. Copy .env.example -> .env rồi điền DATABASE_URL_RO."; exit 1
}

$url = $null
foreach ($line in Get-Content $envFile) {
  if ($line -match '^\s*DATABASE_URL_RO\s*=\s*(.+?)\s*$') {
    $url = $Matches[1].Trim().Trim('"').Trim("'")
  }
}
if (-not $url) { Write-Error "Thiếu DATABASE_URL_RO trong .env"; exit 1 }

if (-not (Get-Command pg_dump -ErrorAction SilentlyContinue)) {
  Write-Error "pg_dump chưa cài. Cài PostgreSQL client tools, hoặc dùng: supabase db dump --schema public -f schema.sql"
  exit 1
}

$out = Join-Path $root 'schema.sql'
Write-Host "Dump public schema (read-only) -> schema.sql ..."
& pg_dump --schema-only --no-owner --no-privileges --schema=public -f $out $url
if ($LASTEXITCODE -ne 0) { Write-Error "pg_dump lỗi (exit $LASTEXITCODE)"; exit $LASTEXITCODE }
Write-Host "OK -> $out"
