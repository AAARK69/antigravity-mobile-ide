#!/usr/bin/env bash
# Antigravity Mobile IDE - Double-Click Desktop Launcher for macOS
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "==================================================="
echo "⚡ Launching Antigravity Desktop Bridge Server..."
echo "==================================================="

# Open the live PWA client in default browser
open "https://aaark69.github.io/antigravity-mobile-ide/" 2>/dev/null || true

# Start Node.js server
node server.js
