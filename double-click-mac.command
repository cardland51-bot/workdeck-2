#!/bin/bash
    cd "$(dirname "$0")"
    echo ""
    echo "Starting WorkDeck..."
    if ! command -v node >/dev/null 2>&1; then
      echo "Node.js is required. Opening download page..."
      open "https://nodejs.org/"
      exit 1
    fi
    npm i
    npm run dev
