#!/bin/sh
set -e

echo "[start] DATABASE_URL = $DATABASE_URL"
echo "[start] Running Prisma migrations..."
node bin/prisma-cli.js migrate deploy
echo "[start] Migrations complete, starting server..."
exec node server.js