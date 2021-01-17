import { app, BrowserWindow, Menu } from 'electron';
import { isDev, getWindowOptions, getLoadUrl, getLoadFile, getMenus } from './setup';

export const createWindow = () => {
  const win = new BrowserWindow(getWindowOptions());

  if (isDev()) {
    win.loadURL(getLoadUrl()).catch(err => {
      console.log(err);
      app.quit();
    });
    win.webContents.openDevTools();
  } else {
    win.loadFile(getLoadFile()).then();
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(getMenus()));
};
