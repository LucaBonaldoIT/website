#!/usr/bin/env bash
# Regenerates dist/ from scratch: installs dependencies if missing, then runs a clean
# production build.
#   ./build.sh            clean production build into dist/
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "==> Installing dependencies"
  npm ci
fi

echo "==> Building"
rm -rf dist
npm run --silent build

echo "==> Done: $(du -sh dist | cut -f1) in dist/"
