import server from './server';
import { SERVER_PORT, SERVER_ADDRESS } from './service/env';

server.listen(SERVER_PORT, SERVER_ADDRESS, (err, address) => {
  console.log(address);
  if (err) {
    console.log(err);
  }
});
