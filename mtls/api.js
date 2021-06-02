const {promises: fs} = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');

async function main() {
  const [ca, key, cert] = await Promise.all([
    fs.readFile(path.join(__dirname, 'keys/ca.crt')),
    fs.readFile(path.join(__dirname, 'keys/server.key')),
    fs.readFile(path.join(__dirname, 'keys/server.crt')),
  ]);

  const app = express();
  const server = https.createServer(
    {ca, key, cert, rejectUnauthorized: false, requestCert: true},
    app,
  );

  app.get('/me', function (req, res) {
    // https://nodejs.org/api/tls.html#tls_tlssocket_authorized
    //
    // if ServerOptions::rejectUnauthorized is `true`, the client
    // gets `ECONNRESET` and this code never executes.
    //
    // if ServerOptions::rejectUnauthorized is `false`, the server can
    // respond with a user friendly message.
    if (!req.socket.authorized) {
      return res.sendStatus(401);
    }

    // https://nodejs.org/api/tls.html#tls_tlssocket_getpeercertificate_detailed
    const cert = req.socket.getPeerCertificate();
    res.status(200).json({sub: cert.subject.CN});
  });

  server.listen(8443);
  console.log('ready');
}

main();
