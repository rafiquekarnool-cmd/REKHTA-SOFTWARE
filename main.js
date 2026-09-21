const { app, BrowserWindow, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const logFile = path.join(app.getPath('userData'), 'rekhta-startup.log');
function log(msg) {
  try { fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`); } catch (_) {}
}

process.on('uncaughtException', (err) => {
  log(`uncaughtException: ${err && err.stack ? err.stack : err}`);
  try { dialog.showErrorBox('REKHTA Startup Error', String(err && err.message ? err.message : err)); } catch (_) {}
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1440, height: 900, minWidth: 1024, minHeight: 700,
    show: false, backgroundColor: '#0b2f5b', autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true }
  });

  win.webContents.on('render-process-gone', (_event, details) => log(`render-process-gone: ${JSON.stringify(details)}`));
  win.webContents.on('did-fail-load', (_event, code, desc, url) => {
    log(`did-fail-load: ${code} ${desc} ${url}`);
    dialog.showErrorBox('REKHTA Load Error', `REKHTA could not load.\n\n${desc} (${code})\n\nLog: ${logFile}`);
  });
  win.webContents.on('console-message', (_event, level, message, line, sourceId) => log(`console[${level}] ${message} @ ${sourceId}:${line}`));

  // Windows 8 safety fix: dashboard navigation works even if an inline page handler fails.
  win.webContents.on('did-finish-load', async () => {
    try {
      await win.webContents.executeJavaScript(`
        (() => {
          const dash = document.getElementById('dashboard');
          const shell = document.getElementById('editorShell');
          const title = document.getElementById('docTitle');
          const editorEl = document.getElementById('editor');
          if (!dash || !shell) return;

          function openEditor(mode) {
            window.currentMode = mode;
            dash.classList.add('hidden');
            dash.style.display = 'none';
            shell.style.display = 'flex';
            if (title) title.textContent = (mode === 'booklet' ? 'Booklet' : 'Regular') + ' — Untitled Document';
            try { if (typeof setZoom === 'function') setZoom(100); } catch(e) {}
            try { if (typeof updatePageIndicator === 'function') updatePageIndicator(); } catch(e) {}
            if (editorEl) setTimeout(() => editorEl.focus(), 50);
          }

          window.rekhtaOpenEditor = openEditor;
          const buttons = [...dash.querySelectorAll('button')];
          buttons.forEach((btn, i) => {
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              const text = (btn.textContent || '').toLowerCase();
              const mode = text.includes('booklet') ? 'booklet' : 'regular';
              openEditor(mode);
              if (text.includes('a4')) try { setPage('A4'); } catch(e) {}
              if (text.includes('a3')) try { setPage('A3'); } catch(e) {}
              if (text.includes('a5')) try { setPage('A5'); } catch(e) {}
              if (text.includes('a6')) try { setPage('A6'); } catch(e) {}
            }, true);
          });
        })();
      `, true);
      log('Dashboard navigation safety fix installed');
    } catch (err) {
      log(`Dashboard fix error: ${err.stack || err}`);
    }
  });

  const indexPath = path.join(__dirname, 'index.html');
  log(`Loading ${indexPath}`);
  win.loadFile(indexPath).catch(err => {
    log(`loadFile error: ${err.stack || err}`);
    dialog.showErrorBox('REKHTA Startup Error', `index.html could not be opened.\n\n${err.message}\n\nLog: ${logFile}`);
  });

  win.once('ready-to-show', () => { win.maximize(); win.show(); log('Window shown'); });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) { shell.openExternal(url); return { action: 'deny' }; }
    if (url === 'about:blank' || url === '') return { action: 'allow' };
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  log(`REKHTA starting. Electron ${process.versions.electron}; Chrome ${process.versions.chrome}; Node ${process.versions.node}; ${process.platform} ${process.arch}`);
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
}).catch(err => {
  log(`whenReady error: ${err.stack || err}`);
  dialog.showErrorBox('REKHTA Startup Error', String(err.message || err));
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
