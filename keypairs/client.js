const fetch = require('node-fetch');
const {JWK, JWS} = require('node-jose');

async function getToken() {
  const now = Math.floor(Date.now() / 1000);
  const payload = JSON.stringify({
    iat: now,
    exp: now + 15,
    aud: 'http://localhost:4444/oauth2/token',
    iss: 'client-2',
    sub: 'client-2',
    jti: now.toString(36),
  });
  const key = await JWK.asKey(require('./key.json'));
  const signer = JWS.createSign(
    {
      compact: true,
      fields: {typ: 'JWT'},
    },
    key,
  );
  const assertion = await signer.update(payload).final();
  // console.log('assertion', assertion);

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', 'client-2');
  params.append('audience', 'abc xyz');
  params.append('scope', 'read write');
  params.append(
    'client_assertion_type',
    'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
  );
  params.append('client_assertion', assertion);

  const r = await fetch('http://localhost:4444/oauth2/token', {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });
  return await r.json();
}

async function main() {
  const token = await getToken();
  console.log(token);

  const r = await fetch('http://localhost:8080/me', {
    headers: {
      Authorization: `Bearer ${token['access_token']}`,
    },
  });

  console.log(r.status, r.statusText);
  if (r.ok) {
    console.log(await r.json());
  }
}

main();
