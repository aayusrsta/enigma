#!/bin/bash
set -e

ORBIT_DIR="/Users/amnil/Desktop/orbit"
PORTFOLIO_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET="$PORTFOLIO_DIR/public/guffgaaf"

echo "Building GuffGaaf frontend..."
cd "$ORBIT_DIR"
npm run build

echo "Copying to portfolio..."
rm -rf "$TARGET"
mkdir -p "$TARGET"
cp -r dist/* "$TARGET/"

echo ""
echo "Done. Built files are at public/guffgaaf/"
echo "Now commit and push the portfolio repo to redeploy on Netlify."
