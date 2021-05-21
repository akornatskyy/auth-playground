const {JWK} = require('node-jose');

async function main() {
  const key = await JWK.createKey('RSA', 2048, {
    alg: 'RS256', use: 'sig'
  });
  console.log('private key:', JSON.stringify(key.toJSON(true)));
  console.log('\npublic key:', JSON.stringify(key.toJSON()));
}

main();
