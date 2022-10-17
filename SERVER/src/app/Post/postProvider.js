const { pool } = require("../../../config/database");

const postDao = require("./postDao");

// Provider: Read 비즈니스 로직 처리

exports.printPreviewRecipe = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await postDao.selectAllRecipe(connection);
    connection.release();

    return result;
};

exports.printSearchPreviewRecipe = async function (keyword) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await postDao.selectWhereLikeAllRecipe(connection, keyword);
    connection.release();

    return result;
};

exports.retrieveUserNickname = async function (user_id) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await postDao.selectUserNickname(connection, user_id);
    connection.release();

    return result;
};

exports.retrieveRecipeOwnerId = async function (recipe_id) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await postDao.selectRecipeOwnerId(connection, recipe_id);
    connection.release();

    return result;
};

exports.addRecipe = async function (user_id, user_nickname, recipe_title, recipe_ingredient, recipe_cost, recipe_content, recipe_img_url_1, recipe_img_url_2, recipe_img_url_3, recipe_img_url_4, recipe_img_url_5) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await postDao.insertIntoRecipe(connection, user_id, user_nickname, recipe_title, recipe_ingredient, recipe_cost, recipe_content, recipe_img_url_1, recipe_img_url_2, recipe_img_url_3, recipe_img_url_4, recipe_img_url_5);
    connection.release();

    return result;
};

exports.modifyRecipe = async function (user_nickname, recipe_title, recipe_ingredient, recipe_cost, recipe_content, recipe_img_url_1, recipe_img_url_2, recipe_img_url_3, recipe_img_url_4, recipe_img_url_5, recipe_id) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await postDao.updateSetRecipe(connection, user_nickname, recipe_title, recipe_ingredient, recipe_cost, recipe_content, recipe_img_url_1, recipe_img_url_2, recipe_img_url_3, recipe_img_url_4, recipe_img_url_5, recipe_id);
    connection.release();

    return result;
};

exports.removeRecipe = async function (recipe_id) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await postDao.deleteRecipe(connection, recipe_id);
    connection.release();

    return result;
};

exports.printRecipe = async function (recipe_id) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await postDao.selectRecipe(connection, recipe_id);
    connection.release();

    return result;
};