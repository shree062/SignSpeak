@echo off
title SignSpeak - Sign Language Translation Web App
echo ======================================================================
echo           SignSpeak - MCA Final-Year Project Web Server
echo ======================================================================
echo.
echo Launching SignSpeak in your default web browser...
echo.

cd /d "%~dp0web"

start "" "index.html"

echo Application opened successfully!
echo You can also test with a local HTTP server:
echo    npx serve .
echo    or: py -m http.server 8000
echo.
pause
