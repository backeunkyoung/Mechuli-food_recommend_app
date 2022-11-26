const mysql = require('mysql2/promise');

// 회원 가입
async function insertIntoUser(connection, user_id, user_pw, user_nickname) {
    const query = mysql.format(`INSERT INTO mechuli_schema.userinfo_table(user_id, user_pw, user_nickname)VALUES(?, ?, ?);`, [user_id, user_pw, user_nickname]);
    const Rows = await connection.query(query);

    return Rows;
}

// 회원 조회(id, pw)
async function selectExistsUser(connection, user_id, user_pw) {
    const query = mysql.format(`SELECT EXISTS (SELECT * FROM mechuli_schema.userinfo_table WHERE user_id = ? AND user_pw = ? limit 1) as success;`, [user_id, user_pw]);
    const Rows = await connection.query(query);
  
    return Rows[0];
}

// 회원 조회(id)
async function selectExistsUserId(connection, user_id) {
    const query = mysql.format(`SELECT EXISTS (SELECT * FROM mechuli_schema.userinfo_table WHERE user_id = ? limit 1) as success;`, [user_id]);
    const Rows = await connection.query(query);
  
    return Rows[0];
}

// 회원 id로 nickname 조회 후 반환
async function selectUsernicknameUserId(connection, user_id) {
    const query = mysql.format(`SELECT user_nickname FROM  mechuli_schema.userinfo_table WHERE user_id = ?;`, [user_id]);
    const Rows = await connection.query(query);
  
    return Rows[0];
}


// 회원의 초기 평가 데이터 5개를 DB에 삽입
async function insertIntoRatingTable(connection, user_id, menu_id_1, menu_id_2, menu_id_3, menu_id_4, menu_id_5, score_1, score_2, score_3, score_4, score_5) {
    const query = mysql.format(`INSERT INTO  mechuli_schema.menu_rating_table(user_id, menu_id, score)
    VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?);`,
     [user_id, menu_id_1, score_1,
     user_id, menu_id_2, score_2,
     user_id, menu_id_3, score_3,
     user_id, menu_id_4, score_4,
     user_id, menu_id_5, score_5]);
    const Rows = await connection.query(query);
  
    return Rows[0];
}
  

module.exports = {
    insertIntoUser,
    selectExistsUser,
    selectExistsUserId,
    selectUsernicknameUserId,
    insertIntoRatingTable,
};
