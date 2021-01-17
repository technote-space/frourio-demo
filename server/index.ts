import server from './server';
import { SERVER_PORT } from './service/env';

server.listen(SERVER_PORT, (err, address) => {
  console.log(address);
  if (err) {
    console.log(err);
  }
});
