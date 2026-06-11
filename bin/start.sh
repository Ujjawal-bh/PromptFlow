#!/bin/sh
set -e  # Exit immediately if any command fails

echo "[start] Running Prisma migrations..."
node bin/prisma-cli.js migrate deploy

echo "[start] Migrations complete. Starting server..."
exec node server.js
echo "[start] DATABASE_URL is: $DATABASE_URL"
