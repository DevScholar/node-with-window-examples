import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'node:path';
import * as url from 'node:url';
import * as fs from 'node:fs';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

async function main() {
    await app.whenReady();

    const win = await BrowserWindow.create({
        title: 'Notepad (node-with-window)',
        width: 800,
        height: 600,
        minWidth: 400,
        minHeight: 300,
        resizable: true,
        icon: path.join(__dirname, '../../public/notepad-icon.jpg'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            partition: 'temp:'
        }
    });

    // NOTE: Handlers must NOT be async. The node-ps1-dotnet bridge blocks Node.js
    // inside a synchronous readSync() loop, so Promise microtasks produced by async
    // functions can never run. Sync handlers return values directly and the bridge
    // replies to the renderer immediately.
    ipcMain.handle('show-open-dialog', (_event, options) => {
        const result = win.showOpenDialog(options);
        return result && result.length > 0 ? result[0] : undefined;
    });

    ipcMain.handle('show-save-dialog', (_event, options) => {
        return win.showSaveDialog(options);
    });

    ipcMain.handle('read-file', (_event, filePath: string) => {
        return fs.readFileSync(filePath, 'utf-8');
    });

    ipcMain.handle('write-file', (_event, filePath: string, content: string) => {
        fs.writeFileSync(filePath, content, 'utf-8');
        return true;
    });

    win.loadFile(path.join(__dirname, '../../public/notepad.html'));

    win.setMenu([
        {
            label: 'File',
            submenu: [
                {
                    label: 'New',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => win.send('menu-new')
                },
                {
                    label: 'Open...',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => win.send('menu-open')
                },
                {
                    label: 'Save',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => win.send('menu-save')
                },
                {
                    label: 'Save As...',
                    accelerator: 'CmdOrCtrl+Shift+S',
                    click: () => win.send('menu-save-as')
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    accelerator: 'Alt+F4',
                    click: () => win.close()
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { label: 'Undo',       accelerator: 'CmdOrCtrl+Z', role: 'undo',      click: () => win.send('menu-edit', 'undo') },
                { label: 'Redo',       accelerator: 'CmdOrCtrl+Y', role: 'redo',      click: () => win.send('menu-edit', 'redo') },
                { type: 'separator' },
                { label: 'Cut',        accelerator: 'CmdOrCtrl+X', role: 'cut',       click: () => win.send('menu-edit', 'cut') },
                { label: 'Copy',       accelerator: 'CmdOrCtrl+C', role: 'copy',      click: () => win.send('menu-edit', 'copy') },
                { label: 'Paste',      accelerator: 'CmdOrCtrl+V', role: 'paste',     click: () => win.send('menu-edit', 'paste') },
                { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectAll', click: () => win.send('menu-edit', 'selectAll') }
            ]
        },
        {
            label: 'View',
            submenu: [
                { label: 'Reload',          accelerator: 'CmdOrCtrl+R', role: 'reload',          click: () => win.reload() },
                { label: 'Toggle DevTools', accelerator: 'F12',          role: 'toggleDevTools',  click: () => win.openDevTools() }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click: () => {
                        win.showMessageBox({
                            type: 'info',
                            title: 'About Notepad',
                            message: 'Notepad Example\nBuilt with node-with-window',
                            buttons: ['OK']
                        });
                    }
                }
            ]
        }
    ]);

    win.show();

    console.log('Notepad started');
}

main().catch(console.error);
