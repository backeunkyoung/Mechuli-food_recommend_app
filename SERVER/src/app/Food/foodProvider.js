const { pool } = require("../../../config/database");

const foodDao = require("./foodDao");

// Provider: Read 비즈니스 로직 처리

exports.signUpImgList = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await foodDao.selectSignUpImgList(connection);
    connection.release();

    return result;
};

exports.FoodScoreModifyImgList = async function (keyword) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await foodDao.selectSearchImgList(connection, keyword);
    connection.release();

    return result;
};

exports.FoodInfo = async function (user_id, menu_id) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await foodDao.selectFoodScoreinfo(connection, user_id, menu_id);
    connection.release();

    return result;
};