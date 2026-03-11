import { app, BrowserWindow } from '@devscholar/node-with-window';
import * as path from 'node:path';
import * as url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

async function main() {
    await app.whenReady();

    const win = await BrowserWindow.create({
        title: 'Require Test',
        width: 600,
        height: 400,
        minWidth: 400,
        minHeight: 300,
        resizable: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            partition: 'temp:'
        }
    });

    win.loadFile(path.join(__dirname, '../../public/require-test.html'));

    win.setMenu([
        {
            label: 'File',
            submenu: [
                {
                    label: 'Exit',
                    accelerator: 'Alt+F4',
                    click: () => win.close()
                }
            ]
        }
    ]);
}

main();
