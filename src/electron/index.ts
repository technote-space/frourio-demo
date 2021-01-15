import path from 'path';
import { app, BrowserWindow, Menu } from 'electron';
import server from '../../server/server';
import { SERVER_PORT } from '../../server/service/env';

let win: BrowserWindow | null;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: false, contextIsolation: true },
  });

  if (process.env.MODE === 'dev') {
    win.loadURL('http://localhost:3000/').catch(err => {
      console.log(err);
      process.exit(1);
    });
    win.webContents.openDevTools();
  } else {
    server.listen(SERVER_PORT, (err, address) => {
      console.log(address);
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
    win.loadFile(path.join(__dirname, '../../out/index.html')).then();
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate([{
    label: '予約システム',
    submenu: [{
      label: 'アプリを終了',
      accelerator: 'Cmd+Q',
      click: function() {
        app.quit();
      },
    }],
  }]));

  win.on('closed', () => {
    win = null;
  });
};

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
