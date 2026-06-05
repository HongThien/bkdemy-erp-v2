#!/usr/bin/env bash
# Dump schema public (read-only) từ Supabase -> schema.sql
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

[ -f "$ROOT/.env" ] || { echo ".env không có. cp .env.example .env rồi điền DATABASE_URL_RO"; exit 1; }

URL="$(grep -E '^\s*DATABASE_URL_RO\s*=' "$ROOT/.env" | head -1 | sed -E 's/^[^=]*=\s*//' | sed -E 's/^["'"'"']//; s/["'"'"']$//')"
[ -n "$URL" ] || { echo "Thiếu DATABASE_URL_RO trong .env"; exit 1; }

command -v pg_dump >/dev/null || { echo "pg_dump chưa cài. Hoặc: supabase db dump --schema public -f schema.sql"; exit 1; }

pg_dump --schema-only --no-owner --no-privileges --schema=public -f "$ROOT/schema.sql" "$URL"
echo "OK -> $ROOT/schema.sql"
