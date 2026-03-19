#!/bin/sh
set -e

RUNTIME=node
TARGET=
PASS=

while [ $# -gt 0 ]; do
    case "$1" in
        --runtime=*) RUNTIME="${1#--runtime=}"; shift ;;
        -r=*)        RUNTIME="${1#-r=}"; shift ;;
        *)
            if [ -z "$TARGET" ]; then TARGET="$1"
            else PASS="$PASS $1"; fi
            shift ;;
    esac
done

# Resolve target
[ "$TARGET" = "." ] && TARGET=
if [ -z "$TARGET" ]; then
    if [ -f package.json ]; then
        TARGET=$(node -e "try{const p=require('./package.json');process.stdout.write(p.main||'')}catch{}" 2>/dev/null || true)
    fi
fi
if [ -z "$TARGET" ]; then
    [ -f main.js ] && TARGET=main.js || TARGET=main.ts
fi

if [ ! -f "$TARGET" ]; then
    echo "[node-with-window] Error: $TARGET not found" >&2
    exit 1
fi

# Check extension
case "$TARGET" in
    *.js)
        echo "[node-with-window] Running $TARGET with $RUNTIME..."
        case "$RUNTIME" in
            bun)  bun "$TARGET" $PASS ;;
            deno) deno run --allow-all "$TARGET" $PASS ;;
            *)    node "$TARGET" $PASS ;;
        esac
        exit 0 ;;
esac

# TS: build with esbuild
mkdir -p dist
SD="$(cd "$(dirname "$0")" && pwd)"
EB="$SD/node_modules/.bin/esbuild"
[ -x "$EB" ] || EB="npx esbuild"

echo "[node-with-window] Building $TARGET..."
$EB "$TARGET" \
    --bundle \
    --outfile=dist/main.js \
    --format=esm \
    --platform=node \
    --target=node18 \
    --sourcemap \
    --external:@devscholar/node-with-gjs

echo "[node-with-window] Running with $RUNTIME..."
case "$RUNTIME" in
    bun)  bun dist/main.js $PASS ;;
    deno) deno run --allow-all dist/main.js $PASS ;;
    *)    node dist/main.js $PASS ;;
esac
