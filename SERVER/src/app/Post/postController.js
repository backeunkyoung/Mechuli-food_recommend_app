const postService = require("../../app/Post/postService");

/*
 * API No. 1
 * API Name : 전체 레시피 리스트 조회
 * [GET] /posts
 */
exports.getAllPost = async function (req, res) {
    const result = await postService.getPreviewRecipe();

    // return 값 확인
    console.log("\n----------- return data -------------");
    console.log(result);
    console.log("-------------------------------------");

    return res.send(result);
};

/*
 * API No. 2
 * API Name : 레시피 검색
 * [GET] /posts/result?keyword=
 */
exports.getPostResult = async function (req, res) {
    // console.log("\n----------------------------------------------------------");
    // console.log(req.query.keyword);
    // console.log("----------------------------------------------------------");

    let keyword = req.query.keyword;
    keyword = "%" + keyword + "%";

    const result = await postService.getSearchPreviewRecipe(keyword);

    // return 값 확인
    console.log("\n----------- return data -------------");
    console.log(result);
    console.log("-------------------------------------");

    return res.send(result);
};

/*
 * API No. 3
 * API Name : 레시피 생성
 * [POST] /posts/recipe
 */
exports.postRecipe = async function (req, res) {
    // console.log("\n----------------------------------------------------------");
    // console.log(req.body);
    // console.log("----------------------------------------------------------");

    let user_id = req.body.user_id;
    let recipe_title = req.body.recipe_title;
    let recipe_ingredient = req.body.recipe_ingredient;
    let recipe_cost = req.body.recipe_cost;
    let recipe_content = req.body.recipe_content;
    let recipe_img_url_1 = req.body.recipe_img_url_1;
    let recipe_img_url_2 = req.body.recipe_img_url_2;
    let recipe_img_url_3 = req.body.recipe_img_url_3;
    let recipe_img_url_4 = req.body.recipe_img_url_4;
    let recipe_img_url_5 = req.body.recipe_img_url_5;

    const result = await postService.CreateRecipe(user_id, recipe_title, recipe_ingredient, recipe_cost, recipe_content, recipe_img_url_1, recipe_img_url_2, recipe_img_url_3, recipe_img_url_4, recipe_img_url_5);

    // return 값 확인
    console.log("\n----------- return data -------------");
    console.log(result);
    console.log("-------------------------------------");

    return res.send(result);
};

/*
 * API No. 4
 * API Name : 레시피 수정
 * [PUT] /posts/recipe/:recipeId
 */
exports.putRecipe = async function (req, res) {
    // console.log("\n----------------------------------------------------------");
    // console.log(req.params);

    // console.log("\n----------------------------------------------------------");
    // console.log(req.body);
    // console.log("----------------------------------------------------------");

    let user_id = req.body.user_id;
    let recipe_title = req.body.recipe_title;
    let recipe_ingredient = req.body.recipe_ingredient;
    let recipe_cost = req.body.recipe_cost;
    let recipe_content = req.body.recipe_content;
    let recipe_img_url_1 = req.body.recipe_img_url_1;
    let recipe_img_url_2 = req.body.recipe_img_url_2;
    let recipe_img_url_3 = req.body.recipe_img_url_3;
    let recipe_img_url_4 = req.body.recipe_img_url_4;
    let recipe_img_url_5 = req.body.recipe_img_url_5;
    let recipe_id = req.params.recipeId;

    const result = await postService.updateRecipe(user_id, recipe_title, recipe_ingredient, recipe_cost, recipe_content, recipe_img_url_1, recipe_img_url_2, recipe_img_url_3, recipe_img_url_4, recipe_img_url_5, recipe_id);

    // return 값 확인
    console.log("\n----------- return data -------------");
    console.log(result);
    console.log("-------------------------------------");

    return res.send(result);
};

/*
 * API No. 5
 * API Name : 레시피 삭제
 * [PUT] /posts/recipe/:recipeId
 */
exports.deleteRecipe = async function (req, res) {
    // console.log("\n----------------------------------------------------------");
    // console.log(req.params);

    // console.log("\n----------------------------------------------------------");
    // console.log(req.body);
    // console.log("----------------------------------------------------------");

    let user_id = req.body.user_id;
    let recipe_id = req.params.recipeId;

    const result = await postService.deleteRecipe(user_id, recipe_id);

    // return 값 확인
    console.log("\n----------- return data -------------");
    console.log(result);
    console.log("-------------------------------------");

    return res.send(result);
};

/*
 * API No. 6
 * API Name : 레시피 조회
 * [GET] /posts/recipe/:recipeId
 */
exports.getRecipe = async function (req, res) {
    // console.log("\n----------------------------------------------------------");
    // console.log(req.params);

    // console.log("\n----------------------------------------------------------");
    // console.log(req.body);
    // console.log("----------------------------------------------------------");

    let user_id = req.body.user_id;
    let recipe_id = req.params.recipeId;

    const result = await postService.getRecipe(user_id, recipe_id);

    // return 값 확인
    console.log("\n----------- return data -------------");
    console.log(result);
    console.log("-------------------------------------");

    return res.send(result);
};