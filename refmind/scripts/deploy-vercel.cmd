@echo off
setlocal
cd /d "%~dp0.."

set "NODE=%CD%\.tools\node\node.exe"
set "NPM=%CD%\.tools\node\npm.cmd"
set "VC=%CD%\.tools\node_modules\vercel\dist\vc.js"

if not exist "%NODE%" (
  echo Portable Node not found. Run scripts\setup-vercel-cli.cmd first.
  exit /b 1
)

if not exist "%VC%" (
  echo Installing Vercel CLI...
  call "%NPM%" install vercel@41.6.2 --no-save --prefix .tools
)

echo Building frontend...
cd frontend
call "%NPM%" run build
if errorlevel 1 exit /b 1
cd ..

echo Deploying to Vercel production...
"%NODE%" "%VC%" deploy --prod --yes
exit /b %ERRORLEVEL%
