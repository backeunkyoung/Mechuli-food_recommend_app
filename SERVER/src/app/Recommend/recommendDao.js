const mysql = require('mysql2/promise');

// 메뉴 정보를 가져옴
async function selectRecommendmenu(connection, menu_id_1, menu_id_2, menu_id_3, menu_id_4, menu_id_5, menu_id_6, menu_id_7, menu_id_8, menu_id_9, menu_id_10) {
    const query = mysql.format(`SELECT menu_id, cvs_name, menu_name, menu_image FROM mechuli_schema.menu_table
    WHERE menu_id = ? OR menu_id = ? OR menu_id = ? OR menu_id = ? OR menu_id = ?
    OR menu_id = ? OR menu_id = ? OR menu_id = ? OR menu_id = ? OR menu_id = ?;`, [menu_id_1, menu_id_2, menu_id_3, menu_id_4, menu_id_5, menu_id_6, menu_id_7, menu_id_8, menu_id_9, menu_id_10]);
    const Rows = await connection.query(query);

    return Rows[0];
}

// 사용자가 해당 음식을 평가한적 있는지 확인
async function selectExistsUserScore(connection, user_id, menu_id) {
    const query = mysql.format(`SELECT EXISTS (SELECT * FROM mechuli_schema.menu_rating_table WHERE user_id = ? AND menu_id = ? limit 1) as success;`, [user_id, menu_id]);
    const Rows = await connection.query(query);

    return Rows[0];
}

// 음식 평가 데이터 삽입
async function insertIntoUserScore(connection, user_id, menu_id, score) {
    const query = mysql.format(`INSERT INTO mechuli_schema.menu_rating_table(user_id, menu_id, score) VALUES (?, ?, ?);`, [user_id, menu_id, score]);
    const Rows = await connection.query(query);

    return Rows[0];
}

// 음식 평가 데이터 수정
async function updateSetUserScore(connection, user_id, menu_id, score) {
    const query = mysql.format(`UPDATE mechuli_schema.menu_rating_table SET score = ? WHERE user_id = ? AND menu_id = ?;`, [score, user_id, menu_id]);
    const Rows = await connection.query(query);

    return Rows[0];
}

module.exports = {
    selectRecommendmenu,
    selectExistsUserScore,
    insertIntoUserScore,
    updateSetUserScore,
};
