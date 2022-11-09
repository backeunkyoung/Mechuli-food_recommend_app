const foodService = require("./foodService");
const urlencode = require('urlencode');

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
    // console.log("\n----------------------------------------------------------");
    // console.log(JSON.stringify(req.headers['keyword']));
    // console.log("----------------------------------------------------------");

    // let keyword = req.query.keyword;
    let keyword = req.headers['keyword'];
    console.log("get keyword : " + keyword);

    if (keyword == undefined) {
        keyword = "";
    }

    // URL Decoding
    let urlDecodedText = urlencode.decode(keyword);
    console.log("decoding keyword : " + urlDecodedText);

    // Base64 Decoding
    // let base64DecodedText = Buffer.from(keyword, "base64").toString('utf8');
    // console.log("Base64 Decoded Text : ", base64DecodedText);

    urlDecodedText = "%" + urlDecodedText + "%";
    const result = await foodService.getFoodScoreModifyImgList(urlDecodedText);

    // return 값 확인
    console.log("\n----------- return data -------------");
    console.log(result);
    console.log("-------------------------------------");

    return res.send(result);
};

/*
 * API No. 3
 * API Name : 평점 추가(수정) 상세 페이지 음식 정보 받아오기
 * [GET] /:userId/:menuId
 */
exports.getFoodMenu = async function (req, res) {
    // console.log("\n----------------------------------------------------------");
    // console.log(req.params);

    // console.log("\n----------------------------------------------------------");
    // console.log(req.body);
    // console.log("----------------------------------------------------------");

    let user_id = req.params.userId;
    let menu_id = req.params.menuId;

    const result = await foodService.getFoodInfo(user_id, menu_id);

    // return 값 확인
    console.log("\n----------- return data -------------");
    console.log(result);
    console.log("-------------------------------------");

    return res.send(result);
};