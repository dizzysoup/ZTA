
import express from "express";
import { server } from "@passwordless-id/webauthn";
import Fido2 from "../utils/fido2.js";
import config from "../utils/config.js";
import crypto from 'crypto';
import dotenv from 'dotenv' ; 
dotenv.config();
import db from "../db/db.js";
//const Fido2 = require("../utils/fido2");
//const config = require("../utils/config");
//const crypto = require("crypto");
import base64 from "@hexagon/base64"
//const base64  = require("@hexagon/base64");
import username from "../utils/username.js";
//const username = require("../utils/username");
const f2l = new Fido2();
import database from "../db/db.js";
//const database = require("../db/db");
import sqlite3 from 'sqlite3'
import e from "express";
//const sqlite3 = require('sqlite3').verbose();

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



function base64urlEncode(data) {
	let base64 = data.toString('base64');
	base64 = base64.replace(/=/g, '');
	base64 = base64.replace(/\+/g, '-');
	base64 = base64.replace(/\//g, '_');
	return base64;
}

router.get('/' , async function(req,res){
	res.send("WebAuth is work ");
})

// 回傳challenge 
router.get('/challenge' , async function(req , res ){
	const challenge = crypto.randomBytes(32);
	//const base64urlChallenge = base64urlEncode(challenge);
	const base64urlChallenge  = "YTlTcHtb7VYWguhTwuk5o-8slDjvmwcRWjBRC9xgm-4"
	process.env.CHALLENGE = base64urlChallenge ; 
	 
	console.log(process.env.CHALLENGE)
	return res.send(base64urlChallenge);
})

/* 註冊 */
router.post('/register', async function(req, res) {
	const expected = {
		challenge : process.env.CHALLENGE ,
		origin : "https://frontend.ztasecurity.duckdns.org"
	}
	const con = await db;
	
	//console.table(rows);
	const registration = req.body ; 
	const registrationParsed = await server.verifyRegistration(registration, expected)	
	const id = registrationParsed.credential.id ; 
	const publicKey = registrationParsed.credential.publicKey;
	const algorithm = registrationParsed.credential.algorithm;
	const username = registrationParsed.username;
	const chk = await con.query("select *from user where username = (?)" , username);
	console.log(chk.length);
	if(chk.length == 0 ){
		await con.query("INSERT INTO user values(?,?)" , [username,id]);
		await con.query('INSERT INTO  credentials(id, publicKey,algorithm) values(?,?,?);', [id,publicKey,algorithm]);
		const rows = await con.query("select *from credentials");
		console.table(rows);
		res.send(registrationParsed);
	}else {
		res.send("帳號已註冊");
	}
});

// 登入
router.post("/login", async (req, res) => {
	console.log(req.body);
	var db = new sqlite3.Database('./user.db');
	const result = await db.all('select * from user where username = (?)',[req.body.username], (err,rows) => {
		if(rows.length > 0 )
			res.send("success")
		else{
			res.send("fail")
		} 
	  })
	/*
	if(!ctx.body || !ctx.body.username) {
		return ctx.body = {
			"status": "failed",
			"message": "ctx missing username field!"
		};
	}

	let usernameClean = username.clean(ctx.body.username);
	
	let db = database.getData("/");
	console.log(db);
	//if(!database.users[usernameClean] || !database.users[usernameClean].registered) {
	if(!db.users ||  !db.users[usernameClean] || !db.users[usernameClean].registered) {
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
	*/
	//return ctx.body = assertionOptions;
});
export default router ;
//module.exports = router;
