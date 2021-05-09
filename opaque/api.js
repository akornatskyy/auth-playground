const express = require('express');
const jwt = require('express-jwt');
const { expressJwtSecret } = require('jwks-rsa');
const guard = require('express-jwt-permissions')({
  // requestProperty: 'user',
  permissionsProperty: 'scp'
})

const app = express();
app.use(jwt({
  audience: 'abc',
  credentialsRequired: false,
  issuer: 'http://localhost:4444/',
  algorithms: ['RS256'],

  secret: expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'http://localhost:4456/.well-known/jwks.json',
  }),
}));

app.get('/me', guard.check('read'), function (req, res) {
  console.log(req.headers);
  res.status(200).send(req.user);
})

app.listen(8080);
console.log('ready')
