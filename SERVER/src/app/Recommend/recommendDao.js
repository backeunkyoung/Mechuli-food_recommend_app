const mysql = require('mysql2/promise');

// 회원가입 페이지에 사용할 음식 리스트(5개) 가져오기
async function selectSignUpImgList(connection) {
    const query = mysql.format(`SELECT menu_id, store_name, menu_name, menu_image FROM food_db.CONVENIENCE_STORE_MENU_SAMPLE WHERE menu_id IN (1, 2, 3, 4, 5);`);
    const Rows = await connection.query(query);

    return Rows[0];
}

// 평점 수정하기 페이지 키워드에 따른 음식 리스트 가져오기
async function selectSearchImgList(connection, keyword) {
    const query = mysql.format(`SELECT menu_id, store_name, menu_name, menu_image FROM food_db.CONVENIENCE_STORE_MENU_SAMPLE WHERE menu_name LIKE ?;`, [keyword]);
    const Rows = await connection.query(query);

    return Rows[0];
}

// 평점 수정하기 페이지 음식 정보 및 사용자의 score 가져오기
async function selectFoodScoreinfo(connection, user_id, menu_id) {
    const query = mysql.format(`SELECT menu.menu_id, menu.store_name, menu.menu_name, menu.menu_image, score.user_score
     FROM food_db.CONVENIENCE_STORE_MENU_SAMPLE AS menu
     LEFT JOIN food_db.USER_MENU_SCORE_SAMPLE AS score
     ON menu.menu_id = score.menu_id AND score.user_id = ?
     WHERE menu.menu_id = ?;`, [user_id, menu_id]);
    const Rows = await connection.query(query);

    return Rows[0];
}

module.exports = {
    selectSignUpImgList,
    selectSearchImgList,
    selectFoodScoreinfo,
};
