#!/bin/bash
    cd "$(dirname "$0")"
    echo "Installing dependencies (first run only)..."
    npm i
    npm start
