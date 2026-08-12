#!/usr/bin/env bash
# Antigravity Mobile IDE - Double-Click Desktop Launcher for Linux
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "==================================================="
echo "⚡ Launching Antigravity Desktop Bridge Server..."
echo "==================================================="

# Open default browser on Linux (freedesktop standard)
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "https://aaark69.github.io/antigravity-mobile-ide/" 2>/dev/null &
elif command -v sensible-browser >/dev/null 2>&1; then
  sensible-browser "https://aaark69.github.io/antigravity-mobile-ide/" 2>/dev/null &
fi

# Start Node.js Desktop Bridge Server
node server.js
