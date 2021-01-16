import { app, dialog } from 'electron';
import { isDev } from './setup';
import { SERVER_PORT } from '../../../server/service/env';
import server from '../../../server/server';

export const runServer = () => {
  if (!isDev()) {
    server.listen(SERVER_PORT, ((err, address) => {
      console.log(address);
      if (err) {
        dialog.showErrorBox('Server Error', err.message);
        app.quit();
      }
    }));
  }
};
