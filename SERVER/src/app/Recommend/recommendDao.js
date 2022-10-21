const mysql = require('mysql2/promise');

// 사용자가 해당 음식을 평가한적 있는지 확인
async function selectExistsUserScore(connection, user_id, menu_id) {
    const query = mysql.format(`SELECT EXISTS (SELECT * FROM mechuli_schema.menu_rating_table WHERE user_id = ? AND menu_id = ? limit 1) as success;`, [user_id, menu_id]);
    const Rows = await connection.query(query);

    return Rows[0];
}

// 음식 평가 데이터 삽입
async function insertIntoUserScore(connection, user_id, menu_id, user_score) {
    const query = mysql.format(`INSERT INTO mechuli_schema.menu_rating_table(user_id, menu_id, score) VALUES (?, ?, ?);`, [user_id, menu_id, user_score]);
    const Rows = await connection.query(query);

    return Rows[0];
}

// 음식 평가 데이터 수정
async function updateSetUserScore(connection, user_id, menu_id, user_score) {
    const query = mysql.format(`UPDATE mechuli_schema.menu_rating_table SET score = ? WHERE user_id = ? AND menu_id = ?;`, [user_score, user_id, menu_id]);
    const Rows = await connection.query(query);

    return Rows[0];
}

module.exports = {
    selectExistsUserScore,
    insertIntoUserScore,
    updateSetUserScore,
};
