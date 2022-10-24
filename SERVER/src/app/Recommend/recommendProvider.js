const { pool } = require("../../../config/database");

const recommendDao = require("./recommendDao");

// Provider: Read 비즈니스 로직 처리

exports.getRecommendList = async function (menu_id_1, menu_id_2, menu_id_3, menu_id_4, menu_id_5, menu_id_6, menu_id_7, menu_id_8, menu_id_9, menu_id_10) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await recommendDao.selectRecommendmenu(connection, menu_id_1, menu_id_2, menu_id_3, menu_id_4, menu_id_5, menu_id_6, menu_id_7, menu_id_8, menu_id_9, menu_id_10);
    connection.release();

    return result;
};

exports.foodScoreIsExist = async function (user_id, menu_id) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await recommendDao.selectExistsUserScore(connection, user_id, menu_id);
    connection.release();

    return result;
};

exports.scoreADD = async function (user_id, menu_id, score) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await recommendDao.insertIntoUserScore(connection, user_id, menu_id, score);
    connection.release();

    return result;
};

exports.scoreModify = async function (user_id, menu_id, score) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await recommendDao.updateSetUserScore(connection, user_id, menu_id, score);
    connection.release();

    return result;
};