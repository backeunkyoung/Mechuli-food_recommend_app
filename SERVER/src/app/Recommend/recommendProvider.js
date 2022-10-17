const { pool } = require("../../../config/database");

const recommendDao = require("./recommendDao");

// Provider: Read 비즈니스 로직 처리

exports.foodScoreIsExist = async function (user_id, menu_id) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await recommendDao.selectExistsUserScore(connection, user_id, menu_id);
    connection.release();

    return result;
};

exports.scoreADD = async function (user_id, menu_id, user_score) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await recommendDao.insertIntoUserScore(connection, user_id, menu_id, user_score);
    connection.release();

    return result;
};

exports.scoreModify = async function (user_id, menu_id, user_score) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await recommendDao.updateSetUserScore(connection, user_id, menu_id, user_score);
    connection.release();

    return result;
};