import { app, BrowserWindow, ipcMain } from '@devscholar/node-with-window';
import * as path from 'node:path';
import * as url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

async function main() {
    await app.whenReady();

    const win = new BrowserWindow({
        width: 300,
        height: 300,
        transparent: true,
        resizable: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    ipcMain.handle('exit', () => {
        win.close();
    });

    win.loadFile(path.join(__dirname, 'transparent.html'));
}

main().catch(console.error);
