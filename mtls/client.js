const {promises: fs} = require('fs');
const path = require('path');
const {Agent} = require('https');
const fetch = require('node-fetch');

async function getAgent() {
  const [ca, key, cert] = await Promise.all([
    fs.readFile(path.join(__dirname, 'keys/ca.crt')),
    fs.readFile(path.join(__dirname, 'keys/client.key')),
    fs.readFile(path.join(__dirname, 'keys/client.crt')),
  ]);
  return new Agent({ca, cert, key, rejectUnauthorized: true});
}

async function main() {
  const agent = await getAgent();
  const r = await fetch('https://localhost:8443/me', {
    agent,
  });

  console.log(r.status, r.statusText);
  if (r.ok) {
    console.log(await r.json());
  }
}

main();
