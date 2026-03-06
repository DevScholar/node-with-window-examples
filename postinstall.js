// Runs after every `npm install` to ensure platform-specific packages have their
// dist/ built. The published npm packages for node-ps1-dotnet and node-with-gjs
// may not include pre-built dist/ directories, so we compile them with esbuild.
//
// The proper long-term fix is for those packages to declare "os": ["win32"] /
// "os": ["linux"] in their package.json so npm skips them on wrong platforms.
// Until they do, this script handles the build step automatically.

import { spawnSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '.');
const esbuild = resolve(root, 'node_modules/.bin/esbuild');

function buildDist(pkgName, srcFiles) {
    const pkgDir = resolve(root, 'node_modules', ...pkgName.split('/'));
    if (!existsSync(pkgDir)) return; // not installed (optional dep skipped)

    const distIndex = resolve(pkgDir, 'dist/index.js');
    if (existsSync(distIndex)) return; // already built

    // Filter to only files that actually exist (package versions may differ)
    const presentSrc = srcFiles.filter(f => existsSync(resolve(pkgDir, f)));
    if (presentSrc.length === 0) return;

    console.log(`postinstall: building ${pkgName}...`);
    const result = spawnSync(esbuild, [
        ...presentSrc,
        '--format=esm',
        '--outdir=dist',
        '--platform=node',
    ], { cwd: pkgDir, stdio: 'inherit' });

    if (result.status !== 0) {
        console.error(`postinstall: failed to build ${pkgName}`);
    }
}

if (process.platform === 'linux') {
    buildDist('@devscholar/node-with-gjs', ['src/index.ts', 'src/ipc.ts']);
}

if (process.platform === 'win32') {
    buildDist('@devscholar/node-ps1-dotnet', [
        'src/index.ts',
        'src/ipc.ts',
        'src/proxy.ts',
        'src/namespace.ts',
        'src/state.ts',
        'src/types.ts',
        'src/utils.ts',
    ]);
}
