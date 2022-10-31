const recommendProvider = require("./recommendProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const Promise = require('promise');
const PythonShell = require('python-shell').PythonShell;

async function createCSV() {
    const { success, err = '', results }  = await new Promise((resolve, reject) => {

        var options = {
            mode: 'text',
            pythonPath: '',
            pythonOptions: ['-u'],
            scriptPath: 'D:/GitHub/food_recommend_app/SERVER/python',
            encoding : 'utf8'
        }

        PythonShell.run('getCSV.py', options, function(err, results) {
            console.log("\n-- CSV 파일 생성중 --");
            if (err) {
                reject({ success : false, err});
            } else {
                resolve({ success : true, results });
            }
        });
    });

    if (success) {
        return results;
    }
}

async function getRecommendList(user_id) {
    const { success, err = '', results }  = await new Promise((resolve, reject) => {
        // try {
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

        PythonShell.run('main.py', options, function(err, results) {
            console.log("\n-- 추천 알고리즘 실행중 --");
            if (err) {
                reject({ success : false, err});
            } else {
                var getData = results[0];
                var dataStr = getData.substring(1, getData.length-1);
                foodIdArr = dataStr.split(", ");

                menu_id_1 = foodIdArr[0]; menu_id_2 = foodIdArr[1]; menu_id_3 = foodIdArr[2]; menu_id_4 = foodIdArr[3]; menu_id_5 = foodIdArr[4];
                menu_id_6 = foodIdArr[5]; menu_id_7 = foodIdArr[6]; menu_id_8 = foodIdArr[7]; menu_id_9 = foodIdArr[8]; menu_id_10 = foodIdArr[9];

                console.log(menu_id_1, menu_id_2, menu_id_3, menu_id_4, menu_id_5, menu_id_6, menu_id_7, menu_id_8, menu_id_9, menu_id_10);
                if (menu_id_1 != null && menu_id_2 != null && menu_id_3 != null &&menu_id_4 != null && menu_id_5 != null &&
                    menu_id_6 != null && menu_id_7 != null && menu_id_8 != null && menu_id_9 != null && menu_id_10 != null) {

                    let pythonResult = async function (menu_id_1, menu_id_2, menu_id_3, menu_id_4, menu_id_5, menu_id_6, menu_id_7, menu_id_8, menu_id_9, menu_id_10) {
                        results = await recommendProvider.getRecommendList(
                            menu_id_1, menu_id_2, menu_id_3, menu_id_4, menu_id_5, menu_id_6, menu_id_7, menu_id_8, menu_id_9, menu_id_10
                        );

                        resolve({ success : true, results });
                    }

                    pythonResult(menu_id_1, menu_id_2, menu_id_3, menu_id_4, menu_id_5, menu_id_6, menu_id_7, menu_id_8, menu_id_9, menu_id_10);
                }
            }
        });
    });

    if (success) {
        return results;
    }
}

exports.getUserRecommendMenuList = async function (user_id) {
    try {
        console.log("\n----------------------------------------------------------");
        console.log("user_id : " + user_id);
        console.log("----------------------------------------------------------");

        // await createCSV();

        let result = await getRecommendList(user_id);

        return response(baseResponse.SUCCESS, result);

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
