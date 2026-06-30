@echo off
setlocal
cd /d "%~dp0.."

set "TOOLS=%CD%\.tools"
set "NODE=%TOOLS%\node\node.exe"
set "NPM=%TOOLS%\node\npm.cmd"

if exist "%NODE%" (
  echo Portable Node already installed.
  goto install_vc
)

echo Downloading portable Node.js 22...
if not exist "%TOOLS%" mkdir "%TOOLS%"
cd /d "%TOOLS%"

powershell -NoProfile -Command ^
  "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v22.14.0/node-v22.14.0-win-x64.zip' -OutFile 'node.zip' -UseBasicParsing; Expand-Archive -Path 'node.zip' -DestinationPath . -Force; if (Test-Path 'node') { Remove-Item -Recurse -Force 'node' }; Rename-Item 'node-v22.14.0-win-x64' 'node'; Remove-Item 'node.zip'"

cd /d "%~dp0.."

:install_vc
echo Installing Vercel CLI...
call "%NPM%" install vercel@41.6.2 --no-save --prefix .tools

echo.
echo Done. Log in once, then deploy:
echo   .tools\node\node.exe .tools\node_modules\vercel\dist\vc.js login
echo   scripts\deploy-vercel.cmd
echo.
echo Or import on Vercel (no CLI):
echo   https://vercel.com/new/import?s=https://github.com/diya28varne/hands-on-labs^&project-name=refmind^&root-directory=refmind
