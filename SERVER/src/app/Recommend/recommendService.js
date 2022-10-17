const recommendProvider = require("./recommendProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

exports.getSignUpImgList = async function () {
    try {
        const rows = await foodProvider.signUpImgList();
        // console.log("\n----------------------------------------------------------");
        // console.log(rows);
        // console.log("----------------------------------------------------------");

        return response(baseResponse.SUCCESS, rows);

    } catch(err) {
        console.log("\n----------------------------------------------------------");
        console.log(err);
        console.log("----------------------------------------------------------");

        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.getFoodScoreModifyImgList = async function (keyword) {
    try {
        const rows = await foodProvider.FoodScoreModifyImgList(keyword);
        // console.log("\n----------------------------------------------------------");
        // console.log(rows);
        // console.log("----------------------------------------------------------");

        return response(baseResponse.SUCCESS, rows);

    } catch(err) {
        console.log("\n----------------------------------------------------------");
        console.log(err);
        console.log("----------------------------------------------------------");

        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.getFoodInfo = async function (user_id, menu_id) {
    try {
        const rows = await foodProvider.FoodInfo(user_id, menu_id);
        // console.log("\n----------------------------------------------------------");
        // console.log(rows);
        // console.log("----------------------------------------------------------");

        return response(baseResponse.SUCCESS, rows[0]);

    } catch(err) {
        console.log("\n----------------------------------------------------------");
        console.log(err);
        console.log("----------------------------------------------------------");

        return errResponse(baseResponse.DB_ERROR);
    }
};