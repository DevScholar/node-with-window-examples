import { app, BrowserWindow } from '@devscholar/node-with-window';
import * as os from 'node:os';
import * as path from 'node:path';
import * as url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const WINDOW_COUNT = 3;

function fullOsName() {
    let s = os.type() + ' ' + os.release();
    try {
        const v = os.version();
        if (v) s += ' [' + v + ']';
    } catch {}
    return s + ' (' + os.arch() + ')';
}

async function main() {
    await app.whenReady();

    // One Node.js process drives every window. Log its identity once so the
    // observer can confirm that all renderer-side window.require('os') calls
    // round-trip back to this single process (see shared-state.cjs).
    console.log('[main] pid=' + process.pid + '  os=' + fullOsName());

    const htmlPath = path.join(__dirname, 'multi-window.html');
    const wins = [];
    for (let i = 0; i < WINDOW_COUNT; i++) {
        const win = new BrowserWindow({
            title: 'Multi-Window ' + (i + 1),
            width: 420,
            height: 360,
            resizable: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
        win.loadFile(htmlPath);
        wins.push(win);
    }

    // Auto-close so an unattended run doesn't leave the process (and an
    // observer) blocked on open windows. Set AUTO_CLOSE_MS=0 to disable.
    const autoCloseMs = Number(process.env.AUTO_CLOSE_MS ?? 5000);
    if (autoCloseMs > 0) {
        setTimeout(() => {
            for (const win of wins) win.close();
        }, autoCloseMs);
    }
}

main().catch(console.error);
