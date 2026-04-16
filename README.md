# Node with Window Examples

⚠️ This project is still in Alpha stage, expect breaking changes.

Examples for [Node with Window](https://github.com/devscholar/node-with-window), a cross-platform windowing library with Electron-compatible API.

## Running the Examples

Install dependencies:

```bash
npm install
```

Then run any example by name:

```bash
node start.js notepad
node start.js transparent
node start.js require-test
```

With a different runtime:

```bash
bun start.js notepad --runtime=bun
deno --allow-all start.js notepad --runtime=deno
```

## Examples

```
notepad/        — text editor with menus and keyboard shortcuts
transparent/    — transparent always-on-top window
require-test/   — demonstrates window.require() (nodeIntegration)
```

### notepad
- Text editor window
- File menu: New / Open / Save / Save As
- Edit menu: Undo / Redo / Cut / Copy / Paste / Select All
- View menu: Reload / Toggle DevTools (F12)
- Help → About

### transparent
- Transparent, always-on-top circular window
- Click Exit to close

### require-test
- Demonstrates `window.require()` with `nodeIntegration: true`
- Calls Node.js `os` module synchronously from the renderer

## Prerequisites

### Windows

- Node.js 18+
- PowerShell 5.1
- .NET Framework 4.8
- WebView2 runtime (pre-installed on Windows 11; [download](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) for Windows 10)
- WebView2 SDK DLLs — install with:
  ```
  node node_modules/@devscholar/node-with-window/scripts/webview2-install.js install
  ```

### Linux

- Node.js 18+
- GJS, GTK 4, and WebKitGTK 6.0

On Ubuntu 24.04 LTS these are pre-installed with a GNOME desktop. If missing:

```bash
sudo apt install gjs gir1.2-gtk-4.0 gir1.2-webkit-6.0
```

## Installation Notes

### Linux — clean install

If you copied the folder from another machine (e.g. a Windows shared folder),
**do not** bring the `node_modules` or `dist` directories — they may contain
Windows-only binaries. Do a clean install instead:

```bash
find . -name node_modules -prune -exec rm -rf {} \; 2>/dev/null
npm install
```

### Linux notes

The WebKit sandbox is disabled automatically by the library when running inside
VMware (`WEBKIT_DISABLE_SANDBOX_THIS_IS_DANGEROUS=1`). On bare-metal the sandbox
runs normally. See the [node-with-window README](https://github.com/devscholar/node-with-window#webkit-sandbox-in-virtual-machines) for details.
