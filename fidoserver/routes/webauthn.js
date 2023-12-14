
import express from "express";
const Fido2 = require("../utils/fido2");
const config = require("../utils/config");
const crypto = require("crypto");
const base64  = require("@hexagon/base64");
const username = require("../utils/username");
const f2l = new Fido2();
const database = require("../db/db");
const sqlite3 = require('sqlite3').verbose();

f2l.init(config.rpId, config.rpName, undefined, config.challengeTimeoutMs);
var router = express.Router();

/**
 * Returns base64url encoded buffer of the given length
 * @param  {Number} len - length of the buffer
 * @return {String}     - base64url random buffer
 */
let randomBase64URLBuffer = (len) => {
	len = len || 32;
	let buff = crypto.randomBytes(len);
	return base64.fromArrayBuffer(buff, true);
};
 

/* 註冊 */
router.post('/register', async function(req, res, next) {
  var db = new sqlite3.Database('./user.db');
  const result = await db.all("select true from user where username = ?",[req.body.username],(err,rows)=>{

    if(err){
      console.log(err);
      db.close();
      return ; 
    }

    if(rows.length > 0){
      console.log(`${req.body.username} 已註冊`)
      db.close();
      return res.send(`Username ${req.body.username} already exists`);
    }
    let id = randomBase64URLBuffer();
     // store  from db 
    db.prepare("INSERT INTO user (username) values (?)").run(req.body.username);
    console.log("註冊成功");
    db.close();
    res.send("註冊成功");
  });
});

// 登入
router.post("/login", async (ctx) => {
	if(!ctx.request.body || !ctx.request.body.username) {
		return ctx.body = {
			"status": "failed",
			"message": "ctx missing username field!"
		};
	}

	let usernameClean = username.clean(ctx.request.body.username);

	let db = database.getData("/");

	//if(!database.users[usernameClean] || !database.users[usernameClean].registered) {
	if(!db.users[usernameClean] || !db.users[usernameClean].registered) {
		return ctx.body = {
			"status": "failed",
			"message": `User ${usernameClean} does not exist!`
		};
	}

	let assertionOptions = await f2l.login(usernameClean);
  console.log(assertionOptions);
	// Transfer challenge and username to session
	ctx.session.challenge = assertionOptions.challenge;
	ctx.session.username  = usernameClean;

	// Pass this, to limit selectable credentials for user... This may be set in response instead, so that
	// all of a users server (public) credentials isn't exposed to anyone
	let allowCredentials = [];
	//for(let authr of database.users[ctx.session.username].authenticators) {
	for(let authr of database.getData("/users/" + ctx.session.username + "/authenticators")) {
		allowCredentials.push({
			type: authr.type,
			id: base64.fromArrayBuffer(authr.credId, true),
			transports: authr.transports
		});
	}

	assertionOptions.allowCredentials = allowCredentials;

	ctx.session.allowCredentials = allowCredentials;

	return ctx.body = assertionOptions;
});

module.exports = router;
