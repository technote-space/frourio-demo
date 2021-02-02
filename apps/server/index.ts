import { promisify } from 'util';
import { exec } from 'child_process';
import { promises, existsSync } from 'fs';
import server from './server';
import { SERVER_PORT, SERVER_ADDRESS } from './service/env';

(async() => {
  if (process.platform !== 'win32') {
    const execAsync = promisify(exec);
    const pidFile = 'server.pid';
    const findPidByFile = async() => {
      if (existsSync(pidFile)) {
        return (await promises.readFile(pidFile)).toString().trim();
      }

      return '';
    };
    const createPidFile = async() => {
      console.log('pid:', process.pid);
      await promises.writeFile(pidFile, `${process.pid}`);
    };
    const findPidByPort = async() => (await execAsync(`lsof -i:${SERVER_PORT} -t || :`)).stdout.trim();
    const kill = async(pid: string) => {
      if (pid) {
        console.log('kill:', pid);
        await execAsync(`kill -9 ${pid} || :`);
      }
    };

    await kill(await findPidByFile());
    await kill(await findPidByPort());
    await createPidFile();
  }
})().then(() => {
  server.listen(SERVER_PORT, SERVER_ADDRESS, (err, address) => {
    console.log(address);
    if (err) {
      console.log(err);
    }
  });
});
