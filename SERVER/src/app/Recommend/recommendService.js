const recommendProvider = require("./recommendProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

exports.putFoodScoreModify = async function (user_id, menu_id, score) {
    try {
        // 평점 추가인지 수정인지 확인
        const existResult = await recommendProvider.foodScoreIsExist(user_id, menu_id);
        
        const isExist = existResult[0].success;

        if (isExist == "0") {   // score add
            await recommendProvider.scoreADD(user_id, menu_id, score);
            return response(baseResponse.SUCCESS);

        } else if (isExist == "1") {    // score modify
            await recommendProvider.scoreModify(user_id, menu_id, score);
            return response(baseResponse.SUCCESS);

        }

        return errResponse(baseResponse.SERVER_ERROR);

    } catch(err) {
        console.log("\n----------------------------------------------------------");
        console.log(err);
        console.log("----------------------------------------------------------");

        return errResponse(baseResponse.DB_ERROR);
    }
};
