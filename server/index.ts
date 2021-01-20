import { promisify } from 'util';
import { exec } from 'child_process';
import server from './server';
import { SERVER_PORT, SERVER_ADDRESS } from './service/env';

(async() => {
  if (process.platform !== 'win32') {
    const execAsync = promisify(exec);
    const pid = (await execAsync(`lsof -i:${SERVER_PORT} -t || :`)).stdout;
    if (pid) {
      await execAsync(`kill -9 ${pid}`);
    }
  }
})().then(() => {
  server.listen(SERVER_PORT, SERVER_ADDRESS, (err, address) => {
    console.log(address);
    if (err) {
      console.log(err);
    }
  });
});
