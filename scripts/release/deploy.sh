#!/usr/bin/env bash
# Alpha DFS AI — Production deployment automation (v1)
# Usage: npm run deploy
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

on_error() {
  echo ""
  echo "✗ Deployment failed at step above."
  echo "  If database was modified, restore from backup:"
  echo "    npm run deploy:rollback -- backups/<timestamp>.db"
  echo "  Then re-run: npm run certify:startup && npm run deploy:smoke"
  exit 1
}
trap on_error ERR

echo "▶ Alpha DFS AI deployment — $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo ""

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "ERROR: DATABASE_URL must be set (use absolute file: path)"
  exit 1
fi

echo "▶ Install dependencies"
npm ci

DB_PATH="${DATABASE_URL#file:}"
if [[ -n "$DB_PATH" && -f "$DB_PATH" ]]; then
  echo "▶ Pre-deploy backup"
  npm run deploy:backup
else
  echo "▶ Skipping backup — database file not found (first deploy)"
fi

echo "▶ Deployment config validation"
npm run certify:deploy

if [[ "${SKIP_DB_SETUP:-}" != "1" ]]; then
  echo "▶ Database setup (schema applied to DATABASE_URL)"
  npm run db:setup
else
  echo "▶ Skipping db:setup (SKIP_DB_SETUP=1)"
fi

echo "▶ Production build"
npm run build

echo "▶ Startup validation"
npm run certify:startup

echo "▶ Smoke test (performs live refresh + analyze against DATABASE_URL)"
npm run deploy:smoke

echo ""
echo "✓ Deployment automation complete"
echo "  Start the application: npm run start --workspace=@alpha-dfs/web"
echo "  Optional HTTP verification: DEPLOY_BASE_URL=http://localhost:3001 npm run deploy:smoke"

if [[ "${PRUNE_BACKUPS:-}" == "1" ]]; then
  echo ""
  echo "▶ Backup retention prune (PRUNE_BACKUPS=1)"
  npm run deploy:backup:prune -- --execute
fi
