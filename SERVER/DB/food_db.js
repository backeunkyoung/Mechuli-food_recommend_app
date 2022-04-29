var mysql = require('mysql');
const food_db = mysql.createPool({
    host : '3.39.194.151',
    port : 3306,
    user : 'user01',
    password : 'qwe@123',
    database : 'food_db'
});

module.exports = food_db;