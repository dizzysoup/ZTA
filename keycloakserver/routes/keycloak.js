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
  // 簽名
  const result = await ( await fetch("https://kong.ztaenv.duckdns.org/keycloak/realms/react-keycloak/protocol/openid-connect/token", requestOptions)).json();
  const access_token = result["access_token"];
  console.log(access_token);
  
  const jwt_data = jwt.decode(access_token, {complete: true});
  const header = jwt_data.header;
  console.log(jwt_data.payload); 
  
  const payload = JSON.stringify(jwt_data);
  const signature = jwt_data.signature;

  // 像RP請求public key
  const encryption_key  = await ( await fetch("https://source.ztaenv.duckdns.org/leetcodebar/publickey/")).json();
  await fs.writeFileSync('public.pem', encryption_key['public_key']);
  const key = await jose.JWK.asKey(encryption_key['public_key'],'pem');
  // Encrypt JWT payload 
  var token = await JWE.createEncrypt({format:'compact'},key).update(payload).final();

  res.send({"sign" : token , "access_token" : access_token});
 
  
});


module.exports = router;
