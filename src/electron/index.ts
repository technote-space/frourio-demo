import { app, BrowserWindow } from 'electron';
import { runServer, createWindow } from './src';

app.on('ready', () => {
  runServer();
  createWindow();
});
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

