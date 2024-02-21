import db from './db.js';



async function CreateConnection() {
    try {
        const con = await db ; 
        await con.query('drop table user ')
        await con.query('create table user(username varchar(20), id  VARCHAR(255)) ');
        console.log('connext success!');
        // 關閉連接
        con.end()

      } catch (error) {
        console.error('連接數據庫時出現錯誤：', error)
      }
}

CreateConnection();