const recommendProvider = require("./recommendProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const PythonShell = require('python-shell').PythonShell;

exports.getUserRecommendMenuList = async function (user_id) {
    try {
        console.log("\n----------------------------------------------------------");
        console.log("user_id : " + user_id);
        console.log("----------------------------------------------------------");

        let menu_id_1; let menu_id_2; let menu_id_3; let menu_id_4; let menu_id_5;
        let menu_id_6; let menu_id_7; let menu_id_8; let menu_id_9; let menu_id_10;

        // 파이썬 코드에 user_id 넘겨 줌
        var options = {
            mode: 'text',
            pythonPath: '',
            pythonOptions: ['-u'],
            scriptPath: 'D:/GitHub/food_recommend_app/SERVER/python',
            args : user_id,
            encoding : 'utf8'
        }
        
        // TODO : 현재 PythonShell이 끝나기 전에 return값을 보내버림 => 순서대로 동작하도록 수정 필요
        PythonShell.run('main.py', options, function(err, results) {
            if (err) {
                console.log("err : " + err);
                return "파이썬 통신 에러";
            } else {

                var getData = results[0];
                var dataStr = getData.substring(1, getData.length-1);
                foodIdArr = dataStr.split(", ");

                menu_id_1 = foodIdArr[0]; menu_id_2 = foodIdArr[1]; menu_id_3 = foodIdArr[2]; menu_id_4 = foodIdArr[3]; menu_id_5 = foodIdArr[4];
                menu_id_6 = foodIdArr[5]; menu_id_7 = foodIdArr[6]; menu_id_8 = foodIdArr[7]; menu_id_9 = foodIdArr[8]; menu_id_10 = foodIdArr[9];

                // TODO : DB값 수정필요 => 엑셀파일 import해야 함
                menu_id_1 = 1; menu_id_2 = 2; menu_id_3 = 3; menu_id_4 = 4; menu_id_5 = 5;
                menu_id_6 = 10; menu_id_7 = 11; menu_id_8 = 12; menu_id_9 = 13; menu_id_10 = 14;
                // DB import 전까지 타이핑으로 지정해줬음

                console.log(menu_id_1, menu_id_2, menu_id_3, menu_id_4, menu_id_5, menu_id_6, menu_id_7, menu_id_8, menu_id_9, menu_id_10);
                if (menu_id_1 != null && menu_id_2 != null && menu_id_3 != null &&menu_id_4 != null && menu_id_5 != null &&
                    menu_id_6 != null && menu_id_7 != null && menu_id_8 != null && menu_id_9 != null && menu_id_10 != null) {

                        let pythonResult = async function (menu_id_1, menu_id_2, menu_id_3, menu_id_4, menu_id_5, menu_id_6, menu_id_7, menu_id_8, menu_id_9, menu_id_10) {
                            const result = await recommendProvider.getRecommendList(
                                menu_id_1, menu_id_2, menu_id_3, menu_id_4, menu_id_5, menu_id_6, menu_id_7, menu_id_8, menu_id_9, menu_id_10
                            );

                            console.log(result);
                            return errResponse(baseResponse.SERVER_ERROR, result);
                        }

                        pythonResult(menu_id_1, menu_id_2, menu_id_3, menu_id_4, menu_id_5, menu_id_6, menu_id_7, menu_id_8, menu_id_9, menu_id_10);
   
                }
            }
        });

    } catch(err) {
        console.log("\n----------------------------------------------------------");
        console.log(err);
        console.log("----------------------------------------------------------");

        return errResponse(baseResponse.SERVER_ERROR);
    }
};

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
