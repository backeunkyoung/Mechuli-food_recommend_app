const foodService = require("./foodService");

/*
 * API No. 1
 * API Name : 회원가입 페이지 음식 리스트 받아오기
 * [GET] /foods/user
 */
exports.getUser = async function (req, res) {
    const result = await foodService.getSignUpImgList();

    // return 값 확인
    console.log("\n----------- return data -------------");
    console.log(result);
    console.log("-------------------------------------");

    return res.send(result);
};

/*
 * API No. 2
 * API Name : 평점 추가(수정)하기 페이지 검색한 음식 리스트 받아오기
 * [GET] /foods/result?keyword=
 */
exports.getResult = async function (req, res) {
    console.log("\n----------------------------------------------------------");
    console.log(req.query);
    console.log(req.query.keyword);
    console.log("----------------------------------------------------------");

    let keyword = req.query.keyword;
    console.log("get keyword : " + keyword);

    // Base64 Decoding
    let base64DecodedText = Buffer.from(keyword, "base64").toString('utf8');
    console.log("Base64 Decoded Text : ", base64DecodedText);

    base64DecodedText = "%" + base64DecodedText + "%";

    const result = await foodService.getFoodScoreModifyImgList(base64DecodedText);

    // return 값 확인
    console.log("\n----------- return data -------------");
    console.log(result);
    console.log("-------------------------------------");

    return res.send(result);
};

/*
 * API No. 3
 * API Name : 평점 추가(수정) 상세 페이지 음식 정보 받아오기
 * [GET] /foods/:menuId
 */
exports.getFoodMenu = async function (req, res) {
    // console.log("\n----------------------------------------------------------");
    // console.log(req.params);

    // console.log("\n----------------------------------------------------------");
    // console.log(req.body);
    // console.log("----------------------------------------------------------");

    let user_id = req.body.user_id;
    let menu_id = req.params.menuId;

    const result = await foodService.getFoodInfo(user_id, menu_id);

    // return 값 확인
    console.log("\n----------- return data -------------");
    console.log(result);
    console.log("-------------------------------------");

    return res.send(result);
};