import { app, BrowserWindow, ipcMain } from '@devscholar/node-with-window';
import * as path from 'node:path';
import * as url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

async function main() {
    await app.whenReady();

    const win = new BrowserWindow({
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

    ipcMain.handle('show-open-dialog', (_event, options) => {
        const result = win.showOpenDialog(options);
        return result && result.length > 0 ? result[0] : undefined;
    });

    ipcMain.handle('show-save-dialog', (_event, options) => {
        return win.showSaveDialog(options);
    });

    win.loadFile(path.join(__dirname, '../../public/notepad.html'));

    win.setMenu([
        {
            label: 'File',
            submenu: [
                {
                    label: 'New',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => win.webContents.send('menu-new')
                },
                {
                    label: 'Open...',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => win.webContents.send('menu-open')
                },
                {
                    label: 'Save',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => win.webContents.send('menu-save')
                },
                {
                    label: 'Save As...',
                    accelerator: 'CmdOrCtrl+Shift+S',
                    click: () => win.webContents.send('menu-save-as')
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
                { label: 'Undo',       accelerator: 'CmdOrCtrl+Z', role: 'undo',      click: () => win.webContents.send('menu-edit', 'undo') },
                { label: 'Redo',       accelerator: 'CmdOrCtrl+Y', role: 'redo',      click: () => win.webContents.send('menu-edit', 'redo') },
                { type: 'separator' },
                { label: 'Cut',        accelerator: 'CmdOrCtrl+X', role: 'cut',       click: () => win.webContents.send('menu-edit', 'cut') },
                { label: 'Copy',       accelerator: 'CmdOrCtrl+C', role: 'copy',      click: () => win.webContents.send('menu-edit', 'copy') },
                { label: 'Paste',      accelerator: 'CmdOrCtrl+V', role: 'paste',     click: () => win.webContents.send('menu-edit', 'paste') },
                { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectAll', click: () => win.webContents.send('menu-edit', 'selectAll') }
            ]
        },
        {
            label: 'View',
            submenu: [
                { label: 'Reload',          accelerator: 'CmdOrCtrl+R', role: 'reload',          click: () => win.webContents.reload() },
                { label: 'Toggle DevTools', accelerator: 'F12',          role: 'toggleDevTools',  click: () => win.webContents.openDevTools() }
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

    console.log('Notepad started');
}

main().catch(console.error);
