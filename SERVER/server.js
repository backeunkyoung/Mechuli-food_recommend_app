// 서버 실행은 해당 경로 터미널에서 node server.js 입력
const express = require('express');
const app = express();
const port = 3333;
const food_db = require('./DB/food_db');

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.listen(port, ()=>{  // 서버 실행 확인
    console.log(`express is running on ${port}`);
});

app.post('/idCheck', (req, res) => {   // id 중복 체크
    console.log("id 중복 체크 실행");
    console.log("req.body : " + JSON.stringify(req.body));

    var id = req.body.id;

    // console.log("get_id : " + id);

    var query = "SELECT EXISTS (SELECT * FROM food_db.USERINFO WHERE user_ID='" + id + "' limit 1) as success";

    food_db.query(query, function (err, row) {
        if (err) {
            console.log('err : ' + err);
            // res.send({result : "fail"});
        }
        else {
            // console.log("중복 체크 완료, " + JSON.stringify(row));
            // console.log("row.success : " + row[0].success);

            var val = parseInt(row[0].success);

            if (val == 1) { // 사용 불가
                console.log("사용 불가");
                res.send({isRedup : false});
            }
            else {  // 사용 가능
                console.log("사용 가능");
                res.send({isRedup : true});
            }
        }
    })

});

app.post('/registration', (req, res) => {   // 회원가입 처리
    console.log("회원가입 처리 실행");
    console.log("req.body : " + JSON.stringify(req.body));
    
    var id = req.body.id;
    var pw = req.body.pw;

    // console.log("get_id : " + id + ", get_pw : " + pw);

    var query = "INSERT INTO food_db.USERINFO(`user_ID`,`user_PASSWORD`)VALUES('" + id + "','" + pw + "')";

    food_db.query(query, function (err, row) {
        if (err) {
            console.log('err : ' + err);
            res.send({result : "fail"});
        }
        else {
            // res.send({msg : "success"});
            console.log("회원가입 성공");
            res.send({result : "success"});
        }
    })
});

app.post('/login', (req, res) => {  // 로그인 처리
    var id = req.body.postId;
    var pw = req.body.postPw;
    console.log("get_id : " + id + " , get_pw : " + pw);

    // var query = "INSERT INTO food_db.USERINFO(`user_ID`,`user_PASSWORD`)VALUES('" + id + "','" + pw + "')";

    // food_db.query(query, function (err, row) {
    //     if (err) {
    //         console.log('err : ' + err);
    //         res.send({result : "fail"});
    //     }
    //     else {
    //         // res.send({msg : "success"});
    //         console.log("로그인 성공");
    //         res.send({result : "success"});
    //     }
    // })
});

app.post('/recommend', (req, res) => {   // 추천 시스템 처리

    console.log("추천 시스템 처리 실행");
    console.log("req.body : " + JSON.stringify(req.body));
    
    var id = req.body.userId;
    console.log("get_id : " + id);

    var food_data;
    var rate_data;
    var table = "FOOD";

    var tableName = ["FOOD", "RATING"];

    tableList(table, function(food_data) {
        foodPrint(food_data);
    });

    table = "RATING";
    tableList(table, function(rate_data) {
        ratePrint(rate_data);
    });

    function foodPrint(food_data) {
        console.log("food_data : " + JSON.stringify(food_data));
    }
    function ratePrint(food_data) {
        console.log("rate_data : " + JSON.stringify(rate_data));
    }
    function tableList(table, callback) {
        var query = "SELECT * FROM food_db." + table + ";";
        // console.log(query);
        food_db.query(query, function (err, row) {
            if (err) {
                callback(err);
                console.log('err :' + err);
            }
            else {
                // console.log("food_info_query 결과 : " + JSON.stringify(row));
                if (table == "FOOD") {
                    food_data = row;
                    callback(row);
                    return row;
                }
                else if (table == "RATING"){
                    rate_data = row;
                    callback(row);
                    return row;
                }
            }
        }); 
    }
    
});