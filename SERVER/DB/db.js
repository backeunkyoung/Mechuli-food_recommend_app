var mysql = require('mysql');
const db = mysql.createPool({
    host : '3.39.194.151',
    port : 3306,
    user : 'user01',
    password : 'qwe@123',
    database : 'movies_db'
});

module.exports = db;