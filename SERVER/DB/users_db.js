var mysql = require('mysql');
const users_db = mysql.createPool({
    host : '3.39.194.151',
    port : 3306,
    user : 'user01',
    password : 'qwe@123',
    database : 'users'
});

module.exports = users_db;