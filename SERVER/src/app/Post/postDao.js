const mysql = require('mysql2/promise');

// 사용자 닉네임 가져오기
async function selectUserNickname(connection, user_id) {
    const query = mysql.format(`SELECT user_nickname FROM mechuli_schema.userinfo_table WHERE user_id = ?;`, [user_id]);
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
async function selectAllRecipe(connection) {
    const query = mysql.format(`SELECT DISTINCT recipe.recipe_id, recipe.user_id, recipe.user_nickname, recipe.recipe_title,
    (SELECT COUNT(*) FROM mechuli_schema.reply_table WHERE recipe_id = recipe.recipe_id) AS 'recipe_reply_count',
    (SELECT ROUND (AVG(reply_score), 2) FROM mechuli_schema.reply_table WHERE recipe_id = recipe.recipe_id) AS 'recipe_average_score',
    (SELECT DATE_FORMAT(update_time, '%Y-%m-%d(%a) %H:%i') FROM mechuli_schema.recipe_table WHERE recipe_id = recipe.recipe_id) AS 'update_time',
    recipe.recipe_img_url_1
    FROM mechuli_schema.recipe_table AS recipe
    LEFT JOIN mechuli_schema.reply_table AS reply
    ON recipe.recipe_id = reply.recipe_id;`);
    const Rows = await connection.query(query);

    return Rows[0];
}

// 검색 키워드에 따른 전체 레시피 리스트(미리보기) 조회
async function selectWhereLikeAllRecipe(connection, keyword) {
    const query = mysql.format(`SELECT DISTINCT recipe.recipe_id, recipe.user_id, recipe.user_nickname, recipe.recipe_title,
            (SELECT COUNT(*) FROM mechuli_schema.reply_table WHERE recipe_id = recipe.recipe_id) AS 'recipe_reply_count',
            (SELECT ROUND (AVG(reply_score), 2) FROM mechuli_schema.reply_table WHERE recipe_id = recipe.recipe_id) AS 'recipe_average_score',
            recipe.update_time, recipe.recipe_img_url_1
        FROM mechuli_schema.recipe_table AS recipe
        LEFT JOIN mechuli_schema.reply_table AS reply
        ON recipe.recipe_id = reply.recipe_id WHERE recipe.recipe_title LIKE ?;`, [keyword]);
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
    const query = mysql.format(`SELECT DISTINCT recipe.recipe_id, recipe.user_id, recipe.user_nickname,
    (SELECT COUNT(*) FROM mechuli_schema.reply_table WHERE recipe_id = recipe.recipe_id) AS 'recipe_reply_count',
    (SELECT ROUND (AVG(reply_score), 2) FROM mechuli_schema.reply_table WHERE recipe_id = recipe.recipe_id) AS 'recipe_average_score',
    recipe.recipe_title, recipe.recipe_ingredient, recipe.recipe_cost, recipe.recipe_content,
    (SELECT DATE_FORMAT(create_time, '%Y-%m-%d(%a) %H:%i') FROM mechuli_schema.recipe_table WHERE recipe_id = recipe.recipe_id) AS 'create_time',
    (SELECT DATE_FORMAT(update_time, '%Y-%m-%d(%a) %H:%i') FROM mechuli_schema.recipe_table WHERE recipe_id = recipe.recipe_id) AS 'update_time',
    recipe.recipe_img_url_1, recipe.recipe_img_url_2, recipe.recipe_img_url_3, recipe.recipe_img_url_4, recipe.recipe_img_url_5
    FROM mechuli_schema.recipe_table AS recipe
    LEFT JOIN mechuli_schema.reply_table AS reply
    ON recipe.recipe_id = reply.recipe_id WHERE recipe.recipe_id = ?;`, [recipe_id]);
    const Rows = await connection.query(query);

    return Rows[0];
}

// 레시피 댓글 조회
async function selectReply(connection, recipe_id) {
    const query = mysql.format(`
    SELECT reply_id, reply_user_id, reply_nickname, reply_content, reply_score,
    DATE_FORMAT(reply_create_time, '%Y-%m-%d(%a) %H:%i') AS 'reply_create_time'
    FROM mechuli_schema.reply_table WHERE recipe_id = "1";`, [recipe_id]);
    const Rows = await connection.query(query);

    return Rows[0];
}

// 레시피 댓글 생성
async function insertIntoReply(connection, recipe_id, reply_user_id, reply_nickname, reply_content, reply_score) {
    const query = mysql.format(`INSERT INTO mechuli_schema.reply_table(recipe_id, reply_user_id, reply_nickname, reply_content, reply_score, reply_create_time) VALUES (?, ?, ?, ?, ?, now());`, [recipe_id, reply_user_id, reply_nickname, reply_content, reply_score]);
    const Rows = await connection.query(query);

    return Rows[0];
}

// 레시피 댓글 작성자 id 가져오기
async function selectReplyOwnerId(connection, reply_id) {
    const query = mysql.format(`SELECT reply_user_id FROM mechuli_schema.reply_table WHERE reply_id = ?;`, [reply_id]);
    const Rows = await connection.query(query);

    return Rows[0];
}

// 레시피 댓글 수정
async function updateSetReply(connection, reply_id, reply_content, score, user_nickname) {
    const query = mysql.format(`UPDATE mechuli_schema.reply_table SET reply_nickname = ?, reply_content = ?, reply_score = ? WHERE reply_id=?;`, [user_nickname, reply_content, score, reply_id]);
    const Rows = await connection.query(query);

    return Rows[0];
}

// 레시피 댓글 삭제
async function deleteReply(connection, reply_id) {
    const query = mysql.format(`DELETE FROM mechuli_schema.reply_table WHERE reply_id = ?;`, [reply_id]);
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
    selectReply,
    insertIntoReply,
    selectReplyOwnerId,
    updateSetReply,
    deleteReply,
};
