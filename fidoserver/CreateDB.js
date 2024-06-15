import express from 'express';
var app = express();
const file = './user.db';
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database(file);

db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS user (username , id)");
        
});

db.close();