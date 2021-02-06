import https from 'https';
import fs from 'fs';
import next from 'next';

if (fs.existsSync('localhost.frourio-demo.com-key.pem') && fs.existsSync('localhost.frourio-demo.com.pem')) {
  const hostname = process.env.HOST || 'localhost.frourio-demo.com';
  const port = parseInt(process.env.PORT || '3000', 10);
  const dev = process.env.NODE_ENV !== 'production';
  const app = next({ dev, dir: __dirname });
  const handle = app.getRequestHandler();
  const options = {
    key: fs.readFileSync('localhost.frourio-demo.com-key.pem'),
    cert: fs.readFileSync('localhost.frourio-demo.com.pem'),
  };

  app.prepare().then(() => {
    https.createServer(options, handle).listen(port, hostname, () => {
      console.log(`Server running at https://${hostname}:${port}/`);
    });
  });
} else {
  console.log('The cert files are required.', 'Please run `yarn setup:front` command to prepare them.');
}
