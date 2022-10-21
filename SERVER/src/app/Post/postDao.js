const mysql = require('mysql2/promise');

// 사용자 닉네임 가져오기
async function selectUserNickname(connection, user_id) {
    const query = mysql.format(`SELECT user_nickname FROM mechuli_schema.userinfo_table WHERE user_id = "11";`, [user_id]);
    const Rows = await connection.query(query);

    return Rows[0];
}

// 레시피 작성자 id 가져오기
async function selectRecipeOwnerId(connection, recipe_id) {
    const query = mysql.format(`SELECT user_id FROM mechuli_schema.recipe_table WHERE recipe_id = ?;`, [recipe_id]);
    const Rows = await connection.query(query);

    return Rows[0];
}

// 전체 레시피 리스트(미리보기) 조회
// TODO : recipe_reply_count, recipe_average_score 추가 해서 출력
async function selectAllRecipe(connection) {
    const query = mysql.format(`SELECT recipe_id, user_id, user_nickname, recipe_title, update_time, recipe_img_url_1 FROM mechuli_schema.recipe_table;`);
    const Rows = await connection.query(query);

    return Rows[0];
}

// 검색 키워드에 따른 전체 레시피 리스트(미리보기) 조회
// TODO : recipe_reply_count, recipe_average_score 추가 해서 출력
async function selectWhereLikeAllRecipe(connection, keyword) {
    const query = mysql.format(`SELECT recipe_id, user_id, user_nickname, recipe_title, update_time, recipe_img_url_1
     FROM mechuli_schema.recipe_table WHERE recipe_title LIKE ?;`, [keyword]);
    const Rows = await connection.query(query);

    return Rows[0];
}

// 레시피 생성
async function insertIntoRecipe(connection, user_id, user_nickname, recipe_title, recipe_ingredient, recipe_cost, recipe_content, recipe_img_url_1, recipe_img_url_2, recipe_img_url_3, recipe_img_url_4, recipe_img_url_5) {
    const query = mysql.format(`INSERT INTO mechuli_schema.recipe_table(user_id, user_nickname,
         recipe_title, recipe_ingredient, recipe_cost, recipe_content, create_time, update_time,
          recipe_img_url_1, recipe_img_url_2, recipe_img_url_3, recipe_img_url_4, recipe_img_url_5)
          VALUES(?, ?, ?, ?, ?, ?, now(), now(), ?, ?, ?, ?, ?);`
          , [user_id, user_nickname, recipe_title, recipe_ingredient, recipe_cost, recipe_content,
             recipe_img_url_1, recipe_img_url_2, recipe_img_url_3, recipe_img_url_4, recipe_img_url_5]);
    const Rows = await connection.query(query);

    return Rows;
}

// 레시피 수정
async function updateSetRecipe(connection, user_nickname, recipe_title, recipe_ingredient, recipe_cost, recipe_content, recipe_img_url_1, recipe_img_url_2, recipe_img_url_3, recipe_img_url_4, recipe_img_url_5, recipe_id) {
    const query = mysql.format(`UPDATE mechuli_schema.recipe_table SET
     user_nickname = ?, recipe_title = ?, recipe_ingredient = ?, recipe_cost = ?, recipe_content = ?,
      update_time=now(), recipe_img_url_1 = ?, recipe_img_url_2 = ?, recipe_img_url_3 = ?, recipe_img_url_4 = ?, recipe_img_url_5 = ?
       WHERE recipe_id = ?;`, [user_nickname, recipe_title, recipe_ingredient, recipe_cost, recipe_content, recipe_img_url_1, recipe_img_url_2, recipe_img_url_3, recipe_img_url_4, recipe_img_url_5, recipe_id]);
    const Rows = await connection.query(query);

    return Rows;
}

// 레시피 삭제
async function deleteRecipe(connection, recipe_id) {
    const query = mysql.format(`DELETE FROM mechuli_schema.recipe_table WHERE recipe_id = ?;`, [recipe_id]);
    const Rows = await connection.query(query);

    return Rows;
}

// 레시피 조회
async function selectRecipe(connection, recipe_id) {
    const query = mysql.format(`SELECT * FROM mechuli_schema.recipe_table WHERE recipe_id = ?;`, [recipe_id]);
    const Rows = await connection.query(query);

    return Rows[0];
}

module.exports = {
    selectUserNickname,
    selectRecipeOwnerId,
    selectAllRecipe,
    selectWhereLikeAllRecipe,
    insertIntoRecipe,
    updateSetRecipe,
    deleteRecipe,
    selectRecipe,
};
