import { app, BrowserWindow, ipcMain } from '@devscholar/node-with-window';
import * as path from 'node:path';
import * as url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

let count = 0;

app.on('ready', () => {
    const win = new BrowserWindow({
        title: 'Counter',
        width: 400,
        height: 300,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    ipcMain.handle('get-count', () => {
        console.log(`[main] get-count → ${count}`);
        return count;
    });

    ipcMain.handle('increment', () => {
        count++;
        console.log(`[main] increment → ${count}`);
        return count;
    });

    ipcMain.handle('decrement', () => {
        count--;
        console.log(`[main] decrement → ${count}`);
        return count;
    });

    ipcMain.handle('reset', () => {
        count = 0;
        console.log(`[main] reset → ${count}`);
        return count;
    });

    win.loadFile(path.join(__dirname, '../../public/counter.html'));

    console.log('[main] Counter started');
});
