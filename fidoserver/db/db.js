/*import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db';
//const JsonDB = require('node-json-db').JsonDB
//const Config = require('node-json-db').Config

const database = new JsonDB(new Config("myDataBase", true, false, '/'));

try {
    
    var data = database.getData("/users");
} catch(error) {
    console.log("Created a new db");
    database.push("/users",{});
};
export default database ; 
//module.exports = database;*/
import mariadb from 'mariadb'
//const mariadb = require('mariadb');

const pool = mariadb.createConnection({
    host: '172.18.0.4',
    user: 'user',
    password: 'password',
    database: 'fidodb'
});

export default  pool ; 