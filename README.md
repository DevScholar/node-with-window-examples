# Node with Window Examples

⚠️ This project is still in pre-alpha stage, expect breaking changes.

Examples for [Node with Window](https://github.com/devscholar/node-with-window), a cross-platform windowing library with Electron-compatible API.

## Prerequisites

### Windows

- Node.js 18+
- PowerShell 5.1+
- .NET 6+ runtime
- WebView2 runtime (pre-installed on Windows 11; [download](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) for Windows 10)

### Linux

- Node.js 18+
- GJS, GTK 4, and WebKitGTK 6.0

On Ubuntu 24.04 LTS these are pre-installed with a GNOME desktop. If missing:

```bash
sudo apt install gjs gir1.2-gtk-4.0 gir1.2-webkit2-6.0
```

## Installation

### Windows

```bash
npm install
```

### Linux

If you copied the folder from another machine (e.g. a Windows shared folder),
**do not** bring the `node_modules` directory — it contains Windows-only binaries.
Do a clean install instead:

```bash
rm -rf node_modules dist
npm install
```

`npm install` runs a `postinstall` script that builds the `@devscholar/node-with-gjs`
dependency from source using the bundled esbuild.

## Running the Notepad Example

```bash
npm run notepad
```

### What it does

- Opens a window with a notepad editor
- File menu: New / Open / Save / Save As
- Edit menu: Undo / Redo / Cut / Copy / Paste / Select All
- View menu: Reload / Toggle DevTools (F12)
- Help → About

### Linux notes

- The WebKit sandbox is disabled automatically by the library
  (`WEBKIT_DISABLE_SANDBOX_THIS_IS_DANGEROUS=1`), which is needed in VMware
  and other VMs where `bwrap` cannot create user namespaces.
- After any change to the `node-with-window` source, rebuild it before running:
  ```bash
  cd ../node-with-window && npm run build && cd ../node-with-window-examples && npm run notepad
  ```
