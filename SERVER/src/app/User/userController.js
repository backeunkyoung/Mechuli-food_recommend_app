const userService = require("../../app/User/userService");

/*
 * API No. 1
 * API Name : 회원가입
 * [PUT] /users
 */
exports.putUsers = async function (req, res) {
    // console.log("\n----------------------------------------------------------");
    // console.log(req.body);
    // console.log("----------------------------------------------------------");
    let user_id = req.body.user_id;
    let user_pw = req.body.user_pw;
    let user_nickname = req.body.nickname;
    let signUpRatings = req.body.signUpRatings;

    const result = await userService.signUp(user_id, user_pw, user_nickname, signUpRatings);

    // return 값 확인
    console.log("\n----------- return data -------------");
    console.log(result);
    console.log("-------------------------------------");

    return res.send(result);
};

/*
 * API No. 2
 * API Name : 로그인
 * [POST] /users
 */
exports.postUsers = async function (req, res) {
    // console.log("\n----------------------------------------------------------");
    // console.log(req.body);
    // console.log("----------------------------------------------------------");
    let user_id = req.body.user_id;
    let user_pw = req.body.user_pw;

    const result = await userService.signIn(user_id, user_pw);

    // return 값 확인
    console.log("\n----------- return data -------------");
    console.log(result);
    console.log("-------------------------------------");

    return res.send(result);
};

/*
 * API No. 3
 * API Name : id 중복 체크
 * [GET] /users
 */
exports.getUsers = async function (req, res) {
    // console.log("\n----------------------------------------------------------");
    // console.log(req.query.userId);
    // console.log("----------------------------------------------------------");

    let user_id = req.query.userId;

    const result = await userService.idOverlapCheck(user_id);

    // return 값 확인
    console.log("\n----------- return data -------------");
    console.log(result);
    console.log("-------------------------------------");

    return res.send(result);
};