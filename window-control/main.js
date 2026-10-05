import { app, BrowserWindow, ipcMain } from '@devscholar/node-with-window';
import * as path from 'node:path';
import * as url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

async function main() {
    await app.whenReady();

    const win = new BrowserWindow({
        title: 'Window Control (node-with-window)',
        width: 640,
        height: 480,
        minWidth: 320,
        minHeight: 240,
        resizable: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    // ── Move ────────────────────────────────────────────────────────────
    ipcMain.on('win-move-left', () => {
        const [x, y] = win.getPosition();
        win.setPosition(x - 20, y);
    });
    ipcMain.on('win-move-right', () => {
        const [x, y] = win.getPosition();
        win.setPosition(x + 20, y);
    });
    ipcMain.on('win-move-up', () => {
        const [x, y] = win.getPosition();
        win.setPosition(x, y - 20);
    });
    ipcMain.on('win-move-down', () => {
        const [x, y] = win.getPosition();
        win.setPosition(x, y + 20);
    });
    ipcMain.on('win-center', () => {
        win.center();
    });

    // ── Resize ──────────────────────────────────────────────────────────
    ipcMain.on('win-size-grow', () => {
        const [w, h] = win.getSize();
        win.setSize(w + 40, h + 40);
    });
    ipcMain.on('win-size-shrink', () => {
        const [w, h] = win.getSize();
        win.setSize(Math.max(w - 40, 320), Math.max(h - 40, 240));
    });

    // ── Title ───────────────────────────────────────────────────────────
    ipcMain.on('win-set-title', (_event, title) => {
        win.setTitle(String(title));
    });

    // ── Position / size queries (for the status line) ───────────────────
    ipcMain.handle('win-get-state', () => {
        const [x, y] = win.getPosition();
        const [w, h] = win.getSize();
        return { x, y, w, h };
    });

    // ── GNOME detection (for the renderer-side warning banner) ─────────
    function isGnomeDesktop() {
        const candidates = [
            process.env.XDG_CURRENT_DESKTOP,
            process.env.XDG_SESSION_DESKTOP,
            process.env.DESKTOP_SESSION,
        ];
        return candidates.some(
            v => typeof v === 'string' && v.toLowerCase().includes('gnome')
        );
    }
    ipcMain.handle('win-is-gnome', () => isGnomeDesktop());

    // Keep the renderer's status bar in sync when the user drags/resizes
    // the window by hand (via the native title bar / edges).
    const broadcastState = () => {
        const [x, y] = win.getPosition();
        const [w, h] = win.getSize();
        win.webContents.send('win-state-changed', { x, y, w, h });
    };
    win.on('move', broadcastState);
    win.on('resize', broadcastState);

    win.loadFile(path.join(__dirname, 'window-control.html'));
}

main().catch(console.error);
