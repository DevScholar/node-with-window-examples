// start.js - Build and run TypeScript files with runtime selection
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
let runtime = 'node';
let tsFile = null;
let extraArgs = [];

for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--runtime=')) {
        runtime = arg.split('=')[1];
    } else if (arg.startsWith('-r=')) {
        runtime = arg.split('=')[1];
    } else if (arg.endsWith('.ts') || arg.endsWith('.js')) {
        tsFile = arg;
    } else {
        extraArgs.push(arg);
    }
}

if (!tsFile) {
    console.error('Usage: node start.js <ts-file> [--runtime=node|bun|deno] [args...]');
    console.error('Example: node start.js counter/counter.ts');
    console.error('Example: node start.js notepad/notepad.ts --runtime=deno');
    process.exit(1);
}

const targetScript = path.resolve(tsFile);

if (!fs.existsSync(targetScript)) {
    console.error(`Error: File not found: ${targetScript}`);
    process.exit(1);
}

const runtimeFlags = {
    node: [],
    bun: [],
    deno: ['run', '--allow-all']
};

async function buildAndRun() {
    console.log('Building TypeScript...');

    const ext = path.extname(targetScript);
    const baseName = path.basename(targetScript, ext);
    
    const srcDir = path.join(__dirname, 'src');
    const distDir = path.join(__dirname, 'dist');
    const relativePath = path.relative(srcDir, targetScript);
    const outfile = path.join(distDir, relativePath.replace(/\.ts$/, '.js'));

    const outDir = path.dirname(outfile);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    const platform = process.platform;
    const external = platform === 'win32' 
        ? ['@devscholar/node-ps1-dotnet'] 
        : ['@devscholar/node-with-gjs'];

    console.log(`Target platform: ${platform}`);

    await esbuild.build({
        entryPoints: [targetScript],
        bundle: true,
        outfile: outfile,
        format: 'esm',
        platform: 'node',
        target: 'node18',
        sourcemap: true,
        logLevel: 'info',
        external: external
    });

    console.log('Build complete.');
    console.log(`Running with ${runtime}:`, path.relative(__dirname, outfile));

    const runtimeCmd = runtime;
    const runtimeArgs = runtimeFlags[runtime] || [];
    const finalArgs = runtime === 'deno' 
        ? [...runtimeArgs, outfile, ...extraArgs]
        : [...runtimeArgs, outfile, ...extraArgs];

    const proc = spawn(runtimeCmd, finalArgs, {
        stdio: 'inherit',
        cwd: path.dirname(targetScript),
        env: { ...process.env }
    });

    proc.on('exit', (code) => {
        process.exit(code || 0);
    });

    proc.on('error', (err) => {
        console.error(`Failed to start ${runtime}:`, err.message);
        process.exit(1);
    });
}

buildAndRun().catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
});
