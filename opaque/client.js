const fetch = require("node-fetch")

async function getToken() {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", "my-client");
  params.append("client_secret", process.env.CLIENT_SECRET);

  params.append("audience", "abc xyz");
  params.append("scope", "read write");

  const r = await fetch("http://localhost:4444/oauth2/token", {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params
  });
  return await r.json();
}

async function main() {
  const token = await getToken();
  console.log(token);

  const r = await fetch("http://localhost:4455/me", {
    headers: {
      "Authorization": `Bearer ${token['access_token']}`,
    }
  });

  console.log(r.status, r.statusText);
  if (r.ok) {
    console.log(await r.json());
  }
}

main();
