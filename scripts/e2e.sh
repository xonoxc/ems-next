#!/usr/bin/env bash
set -euo pipefail

PORT=3000
BASE_URL="http://localhost:$PORT"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${YELLOW}[e2e]${NC} $*"; }
ok()    { echo -e "${GREEN}[e2e]${NC} $*"; }
fail()  { echo -e "${RED}[e2e]${NC} $*"; }

cleanup() {
   if [[ -n "${DEV_PID:-}" ]]; then
      info "Stopping dev server (pid $DEV_PID)..."
      kill "$DEV_PID" 2>/dev/null || true
      wait "$DEV_PID" 2>/dev/null || true
   fi
}
trap cleanup EXIT

# --- 1. Dev server (start first so DB seed can use it if needed) --------
if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" 2>/dev/null | grep -q "200"; then
   info "Dev server already running on :$PORT"
   DEV_PID=""
else
   info "Starting dev server on :$PORT..."
   bun dev &
   DEV_PID=$!

   info "Waiting for dev server..."
   for i in $(seq 1 60); do
      if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" 2>/dev/null | grep -q "200"; then
         ok "Dev server ready."
         break
      fi
      if [ "$i" -eq 60 ]; then
         fail "Dev server failed to start after 60s."
         exit 1
      fi
      sleep 1
   done
fi

# --- 2. Seed database (skip if already seeded) --------------------------
SEED_CHECK=$(curl -s "$BASE_URL/api/auth/sign-in/email" \
   -X POST -H "Content-Type: application/json" \
   -d '{"email":"admin@ems.dev","password":"password123"}' 2>/dev/null || true)

if echo "$SEED_CHECK" | grep -q '"token"'; then
   ok "Database already seeded."
else
   info "Seeding database..."
   bun run db:seed 2>&1 | tail -5
   ok "Database seeded."
fi

# --- 3. Playwright ------------------------------------------------------
info "Running Playwright tests..."
bunx playwright test "$@"
EXIT_CODE=$?

if [ "$EXIT_CODE" -eq 0 ]; then
   ok "All tests passed!"
else
   fail "Some tests failed (exit code $EXIT_CODE)."
   info "Run 'bunx playwright show-report' for the HTML report."
fi

exit $EXIT_CODE
