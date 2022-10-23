const recommendService = require("./recommendService");

/*
 * API No. 1
 * API Name : 메뉴 추천받기
 * [GET] /recommends/:userId
 */
exports.getUser = async function (req, res) {
    // console.log("\n----------------------------------------------------------");
    // console.log(req.params);
    // console.log("----------------------------------------------------------");

    let user_id = req.body.user_id;

    const result = await recommendService.getUserMenuList(user_id);

    // return 값 확인
    console.log("\n----------- return data -------------");
    console.log(result);
    console.log("-------------------------------------");

    return res.send(result);
};

/*
 * API No. 2
 * API Name : 평점 추가(수정)하기
 * [PUT] /recommends
 */
exports.putRecommend = async function (req, res) {
    // console.log("\n----------------------------------------------------------");
    // console.log(req.body);
    // console.log("----------------------------------------------------------");

    let user_id = req.body.user_id;
    let menu_id = req.body.menu_id;
    let score = req.body.score;

    const result = await recommendService.putFoodScoreModify(user_id, menu_id, score);

    // return 값 확인
    console.log("\n----------- return data -------------");
    console.log(result);
    console.log("-------------------------------------");

    return res.send(result);
};