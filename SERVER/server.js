// 서버 실행은 해당 경로 터미널에서 node server.js 입력
const express = require('express');
const app = express();
const port = 3333;
const food_db = require('./DB/food_db');

const PythonShell = require('python-shell').PythonShell;

app.use(express.json());
app.use(express.urlencoded({extended : true}));

function tablePrint(tableNames, datas) {
    datas.forEach(function (val, idx) {
        console.log("\n" + tableNames[idx] + JSON.stringify(val));
    })
}

app.listen(port, ()=>{  // 서버 실행 확인
    console.log(`express is running on ${port}`);
});

app.post('/idCheck', (req, res) => {   // id 중복 체크
    console.log("---------id 중복 체크-----------");
    console.log("req.body : " + JSON.stringify(req.body));

    var id = req.body.id;

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
    console.log("--------- 회원가입 처리 -----------");
    console.log("req.body : " + JSON.stringify(req.body));
    
    var id = req.body.id;
    var pw = req.body.pw;
    var signUpRatings = req.body.signUpRatings

    // console.log("get_id : " + id + ", get_pw : " + pw);
    // console.log("signUpRatings : " + signUpRatings);

    // var rateMap = new Map([['떡볶이', 4.0], ['파스타', 2.5]]);
    // rateMap = [['떡볶이', 4.0], ['파스타', 2.5]];
    // var commend = "rateMap = " + signUpRatings + ";";
    // eval(commend);

    var rateStr = signUpRatings.substring(1, signUpRatings.length-1);
    rateStr = rateStr.replace(/\s/gi, "");
    // console.log(rateStr);

    var rateArr = rateStr.split(",");

    var originMap = new Map();
    for (var data of rateArr) {
        var arr = data.split("=");
        originMap.set(arr[0], arr[1]);
    }

    var nameIdMap = new Map();
    for (var [key, value] of originMap) { // save foodId
        // console.log(key + " " + value);

        var query = "SELECT * FROM food_db.FOOD WHERE foodname='" + key + "';";

        food_db.query(query, function (err, row) {  // get foodId
            if (err) {
                console.log('err : ' + err);
            }
            else {
                // console.log(JSON.stringify(row));
                for (var data of row) {
                    // console.log(data.foodname + " " + data.foodid);
                    nameIdMap.set(data.foodname, data.foodid);

                    if (nameIdMap.size == originMap.size) {
                        var count = 0;
                        for (var val of nameIdMap) {
                            var foodName = val[0];
                            var foodId = nameIdMap.get(val[0]);
                            var foodRating = originMap.get(val[0]);
                            // console.log(foodName + " " + foodId + " " + foodRating);

                            query = "INSERT INTO food_db.RATING(userid, foodid, rating) VALUES (" + id + ", " + foodId + ", " + foodRating + ");";
                            food_db.query(query, function (err, row) {  // insert rating data
                                if (err) {
                                    console.log('err : ' + err);
                                }
                                else {
                                    console.log(count + " : rating 정보 등록 성공");
                                    count++;
                                    if (count == originMap.size) {
                                        var query = "INSERT INTO food_db.USERINFO(`user_ID`,`user_PASSWORD`)VALUES('" + id + "','" + pw + "')";

                                        food_db.query(query, function (err, row) {
                                            if (err) {
                                                console.log('err : ' + err);
                                                res.send({result : true});
                                            }
                                            else {
                                                console.log("회원가입 성공");
                                                res.send({result : true});
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            }
        });
    }
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
    // console.log("req.body : " + JSON.stringify(req.body));
    
    var id = req.body.userId;
    console.log("get_id : " + id);

    var tableNames = ["FOOD", "RATING"];
    var queryCommand = [];
    var tables = [];

    for (var i = 0; i < tableNames.length; i++) {
        var command = "SELECT * FROM food_db." + tableNames[i] + ";";
        queryCommand.push(command);
    }

    var callbackFn = function (err, row) {  // callback 함수 설정
        if (!err) { // err가 안뜨면
            tables.push(row);   // tables 배열에 row push
            //tablePrint(tableNames, tables);   // tables 배열 출력
            runPython(tables);  // python code 실행
        }
    }

    food_db.query(queryCommand[0], (err, row) => {    // 프로미스
        if (!err) { // err가 안뜨면
            tables.push(row);   // tables 배열에 row push
            food_db.query(queryCommand[1], callbackFn); // query 처리 후 callbackFn 실행
        }
    });

    var options = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: './python',
        args: ['value1', 'value2', 'value3']
    }

    function runPython(datas) {

        tablePrint(tableNames, datas);
        PythonShell.run('sgd.py', options, function(err, results) {
            if (err) {
                console.log('err :' + err);
                throw err;
            }
            else {
                console.log(results);
            }
        });
    }
    
});