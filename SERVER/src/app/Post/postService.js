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
            const getId = await postProvider.retrieveUserNickname(user_id);
            for (let data of getId) {
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

exports.getRecipe = async function (user_id, recipe_id) {
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

            const rows = await postProvider.printRecipe(recipe_id);
            // console.log("\n----------------------------------------------------------");
            // console.log(rows[0]);
            // console.log("----------------------------------------------------------");

            // TODO : 댓글 리스트도 불러와서 추가하기 => DB 구현 완료 후 작업 예정

            return response(baseResponse.SUCCESS, rows[0]);

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