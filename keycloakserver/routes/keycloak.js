var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const {JWK, JWE} = require('node-jose');
const jose = require('node-jose');
const crypto = require('crypto');
const fs = require('fs');

const generatedKid = () => {
  const randomBytes = crypto.randomBytes(16);
  return randomBytes.toString('hex');
}


/* GET home page. */
router.get('/sign', async function(req, res, next) {
  process.env.CLIENT_SECRET = 'D7lTYb84CF1nJCY7mmPru8QXk4UR90ai'

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "password");
  urlencoded.append("client_id", "Leetcodebar");
  urlencoded.append("username", "user");
  urlencoded.append("password", "user");
  urlencoded.append("client_secret", process.env.CLIENT_SECRET);
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow"
  };
  // 簽名(私要簽名)
  const result = await ( await fetch("https://kong.ztaenv.duckdns.org/keycloak/realms/react-keycloak/protocol/openid-connect/token", requestOptions)).json();
  const access_token = result["access_token"];
  console.log(access_token);
  
  const jwt_data = jwt.decode(access_token, {complete: true});
  const header = jwt_data.header;
  console.log(jwt_data.payload); 
  
  const payload = JSON.stringify(jwt_data);
  const signature = jwt_data.signature;

  // 像RP請求public key
  //const encryption_key  = await ( await fetch("https://source.ztaenv.duckdns.org/leetcodebar/publickey/")).json();
  // 界接LDAP RP public key
  const encryption_key =  await (await fetch("http://aspnet.ztaenv.duckdns.org:5131/api/ResourceAssert")).json();
  
  console.log(encryption_key["publicKey"]);
  await fs.writeFileSync('public.pem', encryption_key["publicKey"]); //儲存成public.pem
  
 const publicKey = encryption_key["publicKey"];


  /*
  const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwGhr2bd1u5JVSWEQjo+UWfH1pE0iK9lm
C//yb5my5PnQ2O62etGX3odWvb10J95pWvhahQcC8wPnjvedZtBxcgHiFOprbYYgZWcXarpw9EO6
H/brPiK1h4akjgNxTdBsFHikzaZ1Erd3T4FEzop8j4pRNrjA/tUHEqxdqOl7H0xHJmbv9odn4Mmq
E/azyohY8LhZ/+YUNbEAT3RCb1Z64tUHow4K+K3QFbNTcEQdN69wNvuAskYsSPCR2f8c6hYShhdf
s8NxnGAKgb9APWvkbLw8+n2/sbHyCmWw5ofW1LokXiCxczqK87UCPMaqFwOt2rlBNrzoMMzWAmH7
s9O6qQIDAQAB
-----END PUBLIC KEY-----`;
*/
 const key = await jose.JWK.asKey( publicKey,'pem'); //將public key 轉成JWK格式
  // Encrypt JWT payload (RP 公鑰加密)
  // var token = "";
  var token = await JWE.createEncrypt({format:'compact'},key).update(access_token).final();
  res.send({"token" : token });
 
});

module.exports = router;
