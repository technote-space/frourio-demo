import { resolve } from 'path';
import { app } from 'electron';

process.chdir(app.isPackaged ? process.resourcesPath : app.getAppPath());

export const getMenus = () => [
  {
    label: '予約システム',
    submenu: [{
      label: 'アプリを終了',
      accelerator: 'Cmd+Q',
      click: function() {
        app.quit();
      },
    }],
  },
];
export const isDev = () => process.env.MODE === 'dev';
export const getWindowOptions = () => ({
  width: 800,
  height: 600,
  webPreferences: { nodeIntegration: false, contextIsolation: true },
});
export const getLoadUrl = () => 'http://localhost:3000/';
export const getLoadFile = () => app.isPackaged ? resolve(process.resourcesPath, 'out/index.html') : resolve(process.cwd(), '../../out/index.html');
