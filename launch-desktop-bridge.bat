@echo off
:: Antigravity Mobile IDE - Double-Click Desktop Launcher for Windows
title Antigravity Desktop Bridge Server
cls
echo ===================================================
echo ⚡ Launching Antigravity Desktop Bridge Server...
echo ===================================================
echo.

:: Open the live PWA client in default browser
start https://aaark69.github.io/antigravity-mobile-ide/

:: Start Node.js Desktop Bridge Server
node server.js
pause
