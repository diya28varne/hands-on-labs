@echo off
REM RefMind frontend — use when `npm` command is broken on Windows
cd /d "%~dp0..\..\frontend"
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev
