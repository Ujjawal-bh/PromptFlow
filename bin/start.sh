#!/bin/sh
set -e

echo "[start] DATABASE_URL = $DATABASE_URL"
echo "[start] Running Prisma migrations..."
node bin/prisma-cli.js migrate deploy --schema=./prisma/schema.prisma
echo "[start] Migration exit code: $?"

echo "[start] Checking tables in DB..."
node bin/prisma-cli.js db execute --stdin --schema=./prisma/schema.prisma << 'SQL'
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
SQL

echo "[start] Starting server..."
exec node server.js