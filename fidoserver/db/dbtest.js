import db from './db.js';
import fs from 'fs' ; 


async function CreateConnection() {
    try {
        const con = await db ; 
        const sqlScript = fs.readFileSync('../init.sql','utf8');
        await con.query('CREATE TABLE IF NOT EXISTS user(username VARCHAR(255), id varchar(255), PRIMARY key (id))')
        await con.query('CREATE TABLE IF NOT EXISTS `credentials` (id VARCHAR(255) PRIMARY KEY,publicKey TEXT,algo VARCHAR(50),FOREIGN KEY (id) REFERENCES user(id) ON DELETE CASCADE);')
        console.log('connext success!');
        // 關閉連接
        con.end()

      } catch (error) {
        console.error('連接數據庫時出現錯誤：', error)
      }
}

CreateConnection();