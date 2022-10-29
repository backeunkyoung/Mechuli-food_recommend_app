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
                return response(baseResponse.SUCCESS, {'user_id': user_id});
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
            console.log(isUser);

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