const mysql = require('mysql2/promise');

// 회원 가입
async function insertIntoUser(connection, user_id, user_pw, user_nickname) {
    const query = mysql.format(`INSERT INTO food_db.user(user_id, user_pw, user_nickname)VALUES(?, ?,  ?);`, [user_id, user_pw, user_nickname]);
    const Rows = await connection.query(query);

    return Rows;
}

// 회원 조회(id, pw)
async function selectExistsUser(connection, user_id, user_pw) {
    const query = mysql.format(`SELECT EXISTS (SELECT * FROM food_db.user WHERE user_id = ? AND user_pw = ? limit 1) as success;`, [user_id, user_pw]);
    const Rows = await connection.query(query);
  
    return Rows[0];
}

// 회원 조회(id)
async function selectExistsUserId(connection, user_id) {
    const query = mysql.format(`SELECT EXISTS (SELECT * FROM food_db.user WHERE user_id = ? limit 1) as success;`, [user_id]);
    const Rows = await connection.query(query);
  
    return Rows[0];
}
  

module.exports = {
    insertIntoUser,
    selectExistsUser,
    selectExistsUserId,
};
