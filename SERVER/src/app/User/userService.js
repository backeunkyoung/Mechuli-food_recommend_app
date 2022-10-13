const userProvider = require("./userProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

exports.signUp = async function (user_id, user_pw, user_nickname, signUpRatings) {
    try {
        console.log("\n----------------------------------------------------------");
        console.log("user_id : " + user_id);
        console.log("user_id : " + user_pw);
        console.log("user_nickname : " + user_nickname);
        console.log("signUpRatings : " + JSON.stringify(signUpRatings));
        console.log("----------------------------------------------------------");
        // console.log(signUpRatings[0]);

        try {
            await userProvider.userSignUp(user_id, user_pw, user_nickname);

            // AFTER : 추천 알고리즘을 위한 초기 평점(signUpRatings) 저장

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
                return response(baseResponse.SUCCESS, {'userId': user_id});
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