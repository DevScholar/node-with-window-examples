@echo off
setlocal EnableDelayedExpansion
set "RUNTIME=node"
set "TARGET="
set "PASS="

:parse
if "%~1"=="" goto :resolve
set "A=%~1"
if "!A:~0,10!"=="--runtime=" ( set "RUNTIME=!A:~10!" & shift & goto :parse )
if "!A:~0,3!"=="-r="         ( set "RUNTIME=!A:~3!"  & shift & goto :parse )
if not defined TARGET ( set "TARGET=%~1" ) else ( set "PASS=!PASS! %~1" )
shift & goto :parse

:resolve
if "!TARGET!"=="." set "TARGET="
if not defined TARGET (
    rem Try to read "main" from package.json via node
    for /f "delims=" %%M in ('node -e "try{const p=require('./package.json');process.stdout.write(p.main||'')}catch{}" 2^>nul') do set "TARGET=%%M"
)
if not defined TARGET (
    if exist main.js  ( set "TARGET=main.js"  ) else ( set "TARGET=main.ts" )
)

if not exist "!TARGET!" (
    echo [node-with-window] Error: !TARGET! not found
    exit /b 1
)

rem Check extension
set "EXT=!TARGET:~-3!"

if "!EXT!"==".js" (
    echo [node-with-window] Running !TARGET! with !RUNTIME!...
    if "!RUNTIME!"=="bun"  ( bun   "!TARGET!" !PASS! ) else ^
    if "!RUNTIME!"=="deno" ( deno run --allow-all "!TARGET!" !PASS! ) else ( node "!TARGET!" !PASS! )
    goto :eof
)

rem TS: build with esbuild
if not exist dist mkdir dist
set "ESBUILD=%~dp0node_modules\.bin\esbuild.cmd"
if not exist "!ESBUILD!" (
    set "ESBUILD=npx.cmd"
    set "EBPRE=esbuild"
) else (
    set "EBPRE="
)

echo [node-with-window] Building !TARGET!...
call "!ESBUILD!" !EBPRE! "!TARGET!" --bundle --outfile=dist\main.js --format=esm --platform=node --target=node18 --sourcemap --external:@devscholar/node-ps1-dotnet
if errorlevel 1 exit /b 1

echo [node-with-window] Running with !RUNTIME!...
if "!RUNTIME!"=="bun"  ( bun   "dist\main.js" !PASS! ) else ^
if "!RUNTIME!"=="deno" ( deno run --allow-all "dist\main.js" !PASS! ) else ( node "dist\main.js" !PASS! )
