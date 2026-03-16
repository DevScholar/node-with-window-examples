# Node with Window Examples

⚠️ This project is still in pre-alpha stage, expect breaking changes.

Examples for [Node with Window](https://github.com/devscholar/node-with-window), a cross-platform windowing library with Electron-compatible API.

## Prerequisites

### Windows

- Node.js 18+
- PowerShell 5.1
- .NET Framework 4.8
- WebView2 runtime (pre-installed on Windows 11; [download](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) for Windows 10)
- WebView2 SDK DLLs — install with:
  ```
  node ../node-with-window/scripts/webview2-install.js install
  ```

### Linux

- Node.js 18+
- GJS, GTK 4, and WebKitGTK 6.0

On Ubuntu 24.04 LTS these are pre-installed with a GNOME desktop. If missing:

```bash
sudo apt install gjs gir1.2-gtk-4.0 gir1.2-webkit-6.0
```

## Installation

### Windows

```bash
npm install
```

### Linux

If you copied the folder from another machine (e.g. a Windows shared folder),
**do not** bring the `node_modules` or `dist` directories — they may contain
Windows-only binaries. Do a clean install instead:

```bash
rm -rf node_modules dist
npm install
```

## Running the Examples

```bash
node start.js src/notepad/notepad.ts
node start.js src/require-test/require-test.ts
node start.js src/transparent/transparent.ts
```

Supported runtimes (optional `--runtime` flag):

```bash
bun start.js src/notepad/notepad.ts --runtime=bun
deno run --allow-all start.js src/notepad/notepad.ts --runtime=deno
```

### What it does

- Opens a window with a notepad editor
- File menu: New / Open / Save / Save As
- Edit menu: Undo / Redo / Cut / Copy / Paste / Select All
- View menu: Reload / Toggle DevTools (F12)
- Help → About

### Linux notes

- The WebKit sandbox is disabled automatically by the library when running inside
  VMware (`WEBKIT_DISABLE_SANDBOX_THIS_IS_DANGEROUS=1`). On bare-metal the sandbox
  runs normally. See the [node-with-window README](https://github.com/devscholar/node-with-window#webkit-sandbox-in-virtual-machines) for details.
