const mysql = require('mysql2/promise');    // promise api => ws7 async await와 잘 동작함

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host : '15.164.233.193',
    port : 3306,
    user : 'user',
    password : 'user',
    database : 'food_db'
});

module.exports = {
    pool: pool
};