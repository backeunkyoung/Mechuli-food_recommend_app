const mysql = require('mysql2/promise');    // promise api => ws7 async await와 잘 동작함

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host : '13.209.81.127',
    port : 3306,
    user : 'user',
    password : 'user',
    database : 'mechuli_schema'
});

module.exports = {
    pool: pool
};