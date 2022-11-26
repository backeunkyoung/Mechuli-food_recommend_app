const userProvider = require("./userProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

exports.signUpLowVer = async function (user_id, user_pw, user_nickname, signUpRatings) {
    try {
        console.log("\n----------------------------------------------------------");
        console.log("user_id : " + user_id);
        console.log("user_pw : " + user_pw);
        console.log("user_nickname : " + user_nickname);
        console.log("signUpRatings : " + JSON.stringify(signUpRatings));
        console.log("----------------------------------------------------------");
        
        var rateStr = signUpRatings.substring(1, signUpRatings.length-1);   // 중괄호{} 제거
        rateStr = rateStr.replace(/\s/gi, "");  // 띄어쓰기 제거
        // console.log(rateStr);

        var rateArr = rateStr.split(",");   // , 기준으로 잘라 배열로 넣기

        var originMap = new Map();
        for (var data of rateArr) {
            var arr = data.split("=");
            originMap.set(arr[0], arr[1]);
        }

        let menu_id = [];
        let score = [];

        for (var [key, value] of originMap) { // save foodId
            // console.log(key + " " + value);
            menu_id.push(key); score.push(value);
        }

        try {
            await userProvider.userSignUp(user_id, user_pw, user_nickname);

            await userProvider.userRatingAdd(user_id, menu_id[0], menu_id[1], menu_id[2], menu_id[3], menu_id[4], score[0], score[1], score[2], score[3], score[4]);

            return response(baseResponse.SUCCESS);

        } catch(err) {
            console.log("\n----------------------------------------------------------");
            console.log(err);
            console.log("----------------------------------------------------------");

            return errResponse(baseResponse.DB_ERROR);
        }

    } catch(err) {
        console.log("\n----------------------------------------------------------");
        console.log(err);
        console.log("----------------------------------------------------------");

        return errResponse(baseResponse.SERVER_ERROR);
    }
};

exports.signUp = async function (user_id, user_pw, user_nickname, signUpRatings) {
    try {
        console.log("\n----------------------------------------------------------");
        console.log("user_id : " + user_id);
        console.log("user_id : " + user_pw);
        console.log("user_nickname : " + user_nickname);
        console.log("signUpRatings : " + JSON.stringify(signUpRatings));
        console.log("----------------------------------------------------------");
        // console.log(signUpRatings[0]);

        let menu_id_1 = signUpRatings[0].menu_id; let score_1 = signUpRatings[0].score;
        let menu_id_2 = signUpRatings[1].menu_id; let score_2 = signUpRatings[1].score;
        let menu_id_3 = signUpRatings[2].menu_id; let score_3 = signUpRatings[2].score;
        let menu_id_4 = signUpRatings[3].menu_id; let score_4 = signUpRatings[3].score;
        let menu_id_5 = signUpRatings[4].menu_id; let score_5 = signUpRatings[4].score;

        try {
            await userProvider.userSignUp(user_id, user_pw, user_nickname);

            await userProvider.userRatingAdd(user_id, menu_id_1, menu_id_2, menu_id_3, menu_id_4, menu_id_5, score_1, score_2, score_3, score_4, score_5);

            return response(baseResponse.SUCCESS);

        } catch(err) {
            console.log("\n----------------------------------------------------------");
            console.log(err);
            console.log("----------------------------------------------------------");

            return errResponse(baseResponse.DB_ERROR);
        }

    } catch(err) {
        console.log("\n----------------------------------------------------------");
        console.log(err);
        console.log("----------------------------------------------------------");

        return errResponse(baseResponse.SERVER_ERROR);
    }
};

exports.signIn = async function (user_id, user_pw) {
    try {
        console.log("\n----------------------------------------------------------");
        console.log("user_id : " + user_id);
        console.log("user_pw : " + user_pw);
        console.log("----------------------------------------------------------");

        try {
            let isUser;

            const rows = await userProvider.userSignIn(user_id, user_pw);
            for (let data of rows) {
                isUser = data.success;
            }

            if (isUser == "1") {
                const user_nickname = await userProvider.getUsersNickname(user_id, user_pw);
                
                return response(baseResponse.SUCCESS, {'user_id': user_id, 'user_nickname': user_nickname[0].user_nickname});
            }
            else if (isUser == "0") {
                return response(baseResponse.USER_USERID_NOT_EXIST);
            }

            return errResponse(baseResponse.SERVER_ERROR);

        } catch(err) {
            console.log("\n----------------------------------------------------------");
            console.log(err);
            console.log("----------------------------------------------------------");

            return errResponse(baseResponse.DB_ERROR);
        }

    } catch(err) {
        console.log("\n----------------------------------------------------------");
        console.log(err);
        console.log("----------------------------------------------------------");

        return errResponse(baseResponse.SERVER_ERROR);
    }
};

exports.idOverlapCheck = async function (user_id) {
    try {
        console.log("\n----------------------------------------------------------");
        console.log("user_id : " + user_id);
        console.log("----------------------------------------------------------");

        try {
            let isUser;

            const rows = await userProvider.userIdOverlap(user_id);
            for (let data of rows) {
                isUser = data.success;
            }

            if (isUser == "1") {
                return response(baseResponse.SIGNUP_REDUNDANT_ID);
            }
            else if (isUser == "0") {
                return response(baseResponse.SUCCESS);
            }

            return response(baseResponse.SERVER_ERROR);

        } catch(err) {
            console.log("\n----------------------------------------------------------");
            console.log(err);
            console.log("----------------------------------------------------------");

            return errResponse(baseResponse.DB_ERROR);
        }

    } catch(err) {
        console.log("\n----------------------------------------------------------");
        console.log(err);
        console.log("----------------------------------------------------------");

        return errResponse(baseResponse.SERVER_ERROR);
    }
};