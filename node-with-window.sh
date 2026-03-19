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
            if [ -z "$TARGET" ]; then
                TARGET="$1"
            else
                PASS="$PASS $1"
            fi
            shift ;;
    esac
done

[ "$TARGET" = "." ] && TARGET=main.ts
[ -z "$TARGET" ] && TARGET=main.ts

if [ ! -f "$TARGET" ]; then
    echo "[node-with-window] Error: $TARGET not found" >&2
    exit 1
fi

mkdir -p dist

SD="$(cd "$(dirname "$0")" && pwd)"
EB="$SD/node_modules/.bin/esbuild"
if [ ! -x "$EB" ]; then
    EB="npx esbuild"
fi

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
