const postProvider = require("./postProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

exports.getPreviewRecipe = async function () {
    try {
        const rows = await postProvider.printPreviewRecipe();
        console.log("\n----------------------------------------------------------");
        console.log(rows);
        console.log("----------------------------------------------------------");

        return response(baseResponse.SUCCESS, rows);

    } catch(err) {
        console.log("\n----------------------------------------------------------");
        console.log(err);
        console.log("----------------------------------------------------------");

        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.getSearchPreviewRecipe = async function (keyword) {
    try {
        const rows = await postProvider.printSearchPreviewRecipe(keyword);
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

exports.CreateRecipe = async function (user_id, recipe_title, recipe_ingredient, recipe_cost, recipe_content, recipe_img_url_1, recipe_img_url_2, recipe_img_url_3, recipe_img_url_4, recipe_img_url_5) {
    try {
        console.log("\n----------------------------------------------------------");
        console.log("user_id : " + user_id);
        console.log("recipe_title : " + recipe_title);
        console.log("recipe_ingredient : " + recipe_ingredient);
        console.log("recipe_cost : " + recipe_cost);
        console.log("recipe_content : " + recipe_content);
        console.log("recipe_img_url_1 : " + recipe_img_url_1);
        console.log("recipe_img_url_2 : " + recipe_img_url_2);
        console.log("recipe_img_url_3 : " + recipe_img_url_3);
        console.log("recipe_img_url_4 : " + recipe_img_url_4);
        console.log("recipe_img_url_5 : " + recipe_img_url_5);

        try {
            // 사용자 닉네임 가져오기
            let user_nickname;
            const getNickname = await postProvider.retrieveUserNickname(user_id);
            for (let data of getNickname) {
                user_nickname = data.user_nickname;
            }
            console.log("user_nickname : " + user_nickname);
            console.log("----------------------------------------------------------");

            await postProvider.addRecipe(user_id, user_nickname, recipe_title, recipe_ingredient, recipe_cost, recipe_content, recipe_img_url_1, recipe_img_url_2, recipe_img_url_3, recipe_img_url_4, recipe_img_url_5);

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

exports.updateRecipe = async function (user_id, recipe_title, recipe_ingredient, recipe_cost, recipe_content, recipe_img_url_1, recipe_img_url_2, recipe_img_url_3, recipe_img_url_4, recipe_img_url_5, recipe_id) {
    try {
        console.log("\n----------------------------------------------------------");
        console.log("user_id : ", user_id);
        console.log("recipe_title : " + recipe_title);
        console.log("recipe_ingredient : " + recipe_ingredient);
        console.log("recipe_cost : " + recipe_cost);
        console.log("recipe_content : " + recipe_content);
        console.log("recipe_img_url_1 : " + recipe_img_url_1);
        console.log("recipe_img_url_2 : " + recipe_img_url_2);
        console.log("recipe_img_url_3 : " + recipe_img_url_3);
        console.log("recipe_img_url_4 : " + recipe_img_url_4);
        console.log("recipe_img_url_5 : " + recipe_img_url_5);
        console.log("recipe_id : " + recipe_id);

        try {
            // 사용자 id == 레시피 작성자 id인지 체크
            let recipe_owner_id;
            const Owner = await postProvider.retrieveRecipeOwnerId(recipe_id);

            for (let data of Owner) {
                recipe_owner_id = data.user_id;
            }

            if (recipe_owner_id != user_id) {
                return response(baseResponse.FORBIDDEN);
            }

            // 사용자 닉네임 가져오기
            let user_nickname;
            const getId = await postProvider.retrieveUserNickname(user_id);
            for (let data of getId) {
                user_nickname = data.user_nickname;
            }
            console.log("user_nickname : " + user_nickname);
            console.log("----------------------------------------------------------");

            await postProvider.modifyRecipe(user_nickname, recipe_title, recipe_ingredient, recipe_cost, recipe_content, recipe_img_url_1, recipe_img_url_2, recipe_img_url_3, recipe_img_url_4, recipe_img_url_5, recipe_id);

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

exports.deleteRecipe = async function (user_id, recipe_id) {
    try {
        console.log("\n----------------------------------------------------------");
        console.log("user_id : ", user_id);
        console.log("recipe_id : " + recipe_id);
        console.log("----------------------------------------------------------");

        try {
            // 사용자 id == 레시피 작성자 id인지 체크
            let recipe_owner_id;
            const Owner = await postProvider.retrieveRecipeOwnerId(recipe_id);

            for (let data of Owner) {
                recipe_owner_id = data.user_id;
            }

            if (recipe_owner_id != user_id) {
                return response(baseResponse.FORBIDDEN);
            }

            await postProvider.removeRecipe(recipe_id);

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

exports.getRecipe = async function (recipe_id) {
    try {
        console.log("\n----------------------------------------------------------");
        console.log("recipe_id : " + recipe_id);
        console.log("----------------------------------------------------------");

        try {
            // 레시피 정보
            const recipeRows = await postProvider.printRecipe(recipe_id);
            console.log("\n----------------------------------------------------------");
            console.log(recipeRows[0]);
            console.log("----------------------------------------------------------");

            // 레시피의 댓글 정보
            const replyrows = await postProvider.printReply(recipe_id);
            console.log("\n----------------------------------------------------------");
            console.log(replyrows);
            console.log("----------------------------------------------------------");

            recipe_id = recipeRows[0].recipe_id;
            let user_id = recipeRows[0].user_id;
            let user_nickname = recipeRows[0].user_nickname;
            let recipe_title = recipeRows[0].recipe_title;
            let recipe_ingredient = recipeRows[0].recipe_ingredient;
            let recipe_cost = recipeRows[0].recipe_cost;
            let recipe_content = recipeRows[0].recipe_content;
            let create_time = recipeRows[0].create_time;
            let update_time = recipeRows[0].update_time;
            let recipe_img_url_1 = recipeRows[0].recipe_img_url_1;
            let recipe_img_url_2 = recipeRows[0].recipe_img_url_2;
            let recipe_img_url_3 = recipeRows[0].recipe_img_url_3;
            let recipe_img_url_4 = recipeRows[0].recipe_img_url_4;
            let recipe_img_url_5 = recipeRows[0].recipe_img_url_5;

            let recipe_replyList = replyrows;

            let returnRows = {"recipe_id" : recipe_id, "user_id" : user_id, "user_nickname" : user_nickname, "recipe_title" : recipe_title
                                , "recipe_ingredient" : recipe_ingredient, "recipe_cost" : recipe_cost, "recipe_content" : recipe_content
                                , "create_time" : create_time, "update_time" : update_time, "recipe_img_url_1" : recipe_img_url_1
                                , "recipe_img_url_2" : recipe_img_url_2, "recipe_img_url_3" : recipe_img_url_3, "recipe_img_url_4" : recipe_img_url_4
                                , "recipe_img_url_5" : recipe_img_url_5, "recipe_replyList" : recipe_replyList};

            return response(baseResponse.SUCCESS, returnRows);

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

exports.postReply = async function (reply_user_id, recipe_id, reply_content, reply_score) {
    try {
        console.log("\n----------------------------------------------------------");
        console.log("reply_user_id : ", reply_user_id);
        console.log("recipe_id : " + recipe_id);
        console.log("reply_content : " + reply_content);
        console.log("reply_score : " + reply_score);

        try {
            // 사용자 닉네임 가져오기
            let reply_nickname;
            const getNickname = await postProvider.retrieveUserNickname(reply_user_id);
            for (let data of getNickname) {
                reply_nickname = data.user_nickname;
            }
            console.log("user_nickname : " + reply_nickname);
            console.log("----------------------------------------------------------");

            const rows = await postProvider.addReply(recipe_id, reply_user_id, reply_nickname, reply_content, reply_score);
            // console.log("\n----------------------------------------------------------");
            // console.log(rows[0]);
            // console.log("----------------------------------------------------------");

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

exports.updateReply = async function (user_id, reply_content, score, reply_id) {
    try {
        console.log("\n----------------------------------------------------------");
        console.log("user_id : ", user_id);
        console.log("reply_content : " + reply_content);
        console.log("score : " + score);
        console.log("reply_id : " + reply_id);

        try {
            // 사용자 id == 댓글 작성자 id인지 체크
            let reply_owner_id;
            const Owner = await postProvider.retrieveReplyOwnerId(reply_id);

            for (let data of Owner) {
                reply_owner_id = data.reply_user_id;
            }

            if (reply_owner_id != user_id) {
                return response(baseResponse.FORBIDDEN);
            }

            // 사용자 닉네임 가져오기
            let user_nickname;
            const getId = await postProvider.retrieveUserNickname(user_id);
            for (let data of getId) {
                user_nickname = data.user_nickname;
            }
            console.log("user_nickname : " + user_nickname);
            console.log("----------------------------------------------------------");

            await postProvider.modifyReply(reply_id, reply_content, score, user_nickname);

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

exports.deleteReply = async function (user_id, reply_id) {
    try {
        console.log("\n----------------------------------------------------------");
        console.log("user_id : ", user_id);
        console.log("reply_id : " + reply_id);
        console.log("----------------------------------------------------------");

        try {
            // 사용자 id == 댓글 작성자 id인지 체크
            let reply_owner_id;
            const Owner = await postProvider.retrieveReplyOwnerId(reply_id);

            for (let data of Owner) {
                reply_owner_id = data.reply_user_id;
            }

            if (reply_owner_id != user_id) {
                return response(baseResponse.FORBIDDEN);
            }

            await postProvider.removeReply(reply_id);

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