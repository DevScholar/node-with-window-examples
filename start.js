import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let runtime = 'node', folder = null;
for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--runtime=')) runtime = arg.slice(10);
    else if (arg.startsWith('-r='))    runtime = arg.slice(3);
    else if (!folder)                  folder = arg;
}

if (!folder) {
    console.error('Usage: node start.js <example> [--runtime=node|bun|deno]');
    console.error('       node start.js notepad');
    console.error('       node start.js transparent --runtime=bun');
    process.exit(1);
}

const folderPath = path.resolve(__dirname, folder);
if (!fs.existsSync(folderPath)) {
    console.error(`Error: example not found: ${folder}`);
    process.exit(1);
}

let main = 'main.js';
try {
    const pkg = JSON.parse(fs.readFileSync(path.join(folderPath, 'package.json'), 'utf8'));
    if (pkg.main) main = pkg.main;
} catch {}

const mainFile = path.join(folderPath, main);
if (!fs.existsSync(mainFile)) {
    console.error(`Error: ${main} not found in ${folder}/`);
    process.exit(1);
}

const runArgs = runtime === 'deno' ? ['run', '--allow-all', mainFile] : [mainFile];
const proc = spawn(runtime, runArgs, { stdio: 'inherit', cwd: folderPath });
proc.on('exit', code => process.exit(code ?? 0));
