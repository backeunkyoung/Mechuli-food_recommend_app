const { pool } = require("../../../config/database");
const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

exports.userSignUp = async function (user_id, user_pw, user_nickname) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await userDao.insertIntoUser(connection, user_id, user_pw, user_nickname);
    connection.release();

    return result;
};

exports.userRatingAdd = async function (user_id, menu_id_1, menu_id_2, menu_id_3, menu_id_4, menu_id_5, score_1, score_2, score_3, score_4, score_5) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await userDao.insertIntoRatingTable(connection, user_id, menu_id_1, menu_id_2, menu_id_3, menu_id_4, menu_id_5, score_1, score_2, score_3, score_4, score_5);
    connection.release();

    return result;
};

exports.userSignIn = async function (user_id, user_pw) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await userDao.selectExistsUser(connection, user_id, user_pw);
    connection.release();
  
    return result;
};

exports.userIdOverlap = async function (user_id) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await userDao.selectExistsUserId(connection, user_id);
    connection.release();
  
    return result;
};