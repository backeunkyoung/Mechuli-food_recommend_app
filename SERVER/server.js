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
        if (!err) {
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

app.post('/getMenuImg', (req, res) => {     // menu img 가져오기
    console.log("---------menu img 가져오기-----------");
    // console.log("req.body : " + JSON.stringify(req.body));

    var nameList = req.body.nameList;
    console.log(JSON.stringify(nameList));

    // var id = req.body.id;

    var queryList = [];

    for (var i = 0; i < nameList.length; i++) {
        var command = "SELECT * FROM food_db.FOOD WHERE foodname = '" + nameList[i] + "';";
        queryList.push(command);
    }

    // for (var i = 0; i < queryList.length; i++) {
    //     console.log(queryList[i]);
    // }

    var resultList = [];
    for (var i = 0; i < queryList.length; i++) {
        var query = queryList[i];

        food_db.query(query, function (err, row) {
            if (!err) {
                // console.log("imgSrc 가져오기, " + JSON.stringify(row));
                for (var data of row) {
                    // console.log(data.foodname + " , " + data.image_1 + " , " + data.image_2);

                    var ob = new Object();
                    ob.foodname = data.foodname;
                    ob.image_1 = data.image_1;
                    ob.image_2 = data.image_2;
                    resultList.push(ob);

                    // var srcList = [];
                    // srcList.push(data.image_1);
                    // srcList.push(data.image_2);

                    // resultMap = new Map();
                    // resultMap.set(data.foodname, srcList);

                    // resultList.push(resultMap);
                    // console.log(resultMap);
                    // console.log("val : " + resultMap.get(data.foodname));

                    // if (resultList.length == nameList.length) {
                    //     // for (var i = 0; i < resultList.length; i++) {
                    //     //     resultList[i].forEach(function(val, key) {
                    //     //         console.log("key : " + key);
                    //     //         console.log("val : " + val);
                    //     //     })
                    //     // }
                    //     console.log("imgSrc List 전송")
                    //     console.log(resultList);
                    //     res.send({resultList : resultList});
                    //     // res.send(resultList);
                    // }

                    if (resultList.length == nameList.length) {
                        console.log(resultList);
                        console.log("imgSrc List 전송")
                        res.send({resultList : resultList});
                    }
                }
            }
        })
    }
});

app.post('/registration', (req, res) => {   // 회원가입 처리
    console.log("--------- 회원가입 처리 -----------");
    console.log("req.body : " + JSON.stringify(req.body));
    
    var id = req.body.id;
    var pw = req.body.pw;
    var signUpRatings = req.body.signUpRatings

    // console.log("get_id : " + id + ", get_pw : " + pw);
    // console.log("signUpRatings : " + signUpRatings);

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
            if (!err) {
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
                                if (!err) {
                                    // console.log(count + " : rating 정보 등록 성공");
                                    count++;
                                    if (count == originMap.size) {
                                        var query = "INSERT INTO food_db.USERINFO(`user_ID`,`user_PASSWORD`)VALUES('" + id + "','" + pw + "')";

                                        food_db.query(query, function (err, row) {
                                            if (!err) {
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
    console.log("--------- 로그인 처리 -----------");
    // console.log(JSON.stringify(req.body));

    var id = req.body.id;
    var pw = req.body.pw;
    console.log("get_id : " + id + " , get_pw : " + pw);

    var query = "SELECT EXISTS (SELECT * FROM food_db.USERINFO WHERE user_ID = '" + id + "' AND user_PASSWORD = '" + pw + "' limit 1) as success;";    
    food_db.query(query, function (err, row) {
        if (!err) {
            var val = parseInt(row[0].success);
            // console.log(val);
            if (val == 1) { // 사용 불가
                console.log("로그인 성공");
                res.send({isUser : true});
            }
            else {
                console.log("로그인 실패(비회원)");
                res.send({isUser : false});
            }
        }
    })
});

app.post('/getMenuList', (req, res) => {   // Food Table 리스트 불러오기
    console.log("---------Food Table 리스트 불러오기-----------");
    console.log("req.body : " + JSON.stringify(req.body));

    var id = req.body.id;

    var usersFoodidList = [];
    var foodidAndRateList = [];
    var resultList = [];
    var getUserRatequery = "SELECT * FROM food_db.RATING WHERE userid = '" + id + "'";
    food_db.query(getUserRatequery, function (err, row) {   // 사용자의 foodid, rating 정보를 RATING table에서 가져오기
        if (!err) {
            for (var data of row) {
                usersFoodidList.push(data.foodid);
                var m = new Map();
                m.set(data.foodid, data.rating);
                foodidAndRateList.push(m);
            }
            
            // console.log(usersFoodidList);
            // console.log(foodidAndRateList);
            if (row.length == foodidAndRateList.length) {
                var getMenuDataQuery = "SELECT * FROM food_db.FOOD;"
                food_db.query(getMenuDataQuery, function (err, row) {   // 모든 메뉴 리스트 받아오기
                    if (!err) {
                        for (var data of row) {
                            var ob = new Object();
                            ob.foodname = data.foodname
                            ob.image_1 = data.image_1
                            ob.image_2 = data.image_2

                            var foodCheck = usersFoodidList.indexOf(data.foodid);
                            if (foodCheck != -1) {
                                var strRate = foodidAndRateList[foodCheck].get(data.foodid);
                                // console.log(data.foodid + " , " + strRate);
                                var floatRate = parseFloat(strRate);
                                ob.rating = floatRate;
                            }
                            else {
                                ob.rating = 0.0;
                            }
                            resultList.push(ob);

                            if (row.length == resultList.length) {
                                // console.log(resultList);
                                console.log("메뉴 List 전송");
                                res.send({menuList : resultList});
                            }
                        }
                    }
                });
            }
            console.log(foodidAndRateList);
        }
    });
});

app.post('/setMenuRating', (req, res) => {   // Rating 정보 수정
    console.log("---------Rating 정보 수정-----------");
    console.log("req.body : " + JSON.stringify(req.body));

    var id = req.body.id;
    var getData = req.body.setRatings;

    var rateStr = getData.substring(1, getData.length-1);
    // console.log(rateStr);

    var rateArr = rateStr.split("=");

    var foodname = rateArr[0];
    var newRate = rateArr[1];

    var foodid;
    var getFoodIdQuery = "SELECT foodid FROM food_db.FOOD WHERE foodname='" + foodname + "';";
    food_db.query(getFoodIdQuery, function (err, row) {
        if (!err) {
            // console.log(JSON.stringify(row));
            for (var data of row) {
                foodid = data.foodid;
                // console.log(foodid);
            }

            var isCheckQuery = "SELECT EXISTS (SELECT * FROM food_db.RATING WHERE userid = '" + id + "' AND foodid = '" + foodid + "' limit 1) as success;";
            food_db.query(isCheckQuery, function (err, row) {
                if (!err) {
                    for (var data of row) {
                        checking = data.success;
                        // console.log(checking);

                        var updateRatingQuery = "";
                        if (checking == 1) {    // update
                            console.log("평가 이력 존재, update 시행");
                            updateRatingQuery = "UPDATE food_db.RATING SET rating = '" + newRate + "' WHERE userid = '" + id + "' AND foodid = '" + foodid + "';";
                        }
                        else {  // insert
                            console.log("평가 이력 없음, insert 시행");
                            updateRatingQuery = "INSERT INTO food_db.RATING(userid, foodid, rating)VALUES('" + id + "', '" + foodid + "', '" + newRate + "');";
                        }

                        food_db.query(updateRatingQuery, function (err, row) {
                            if (!err) {
                                console.log("RATING table 수정 완료");
                                res.send({result : true});
                            }
                        });
                    }
                }
            });
        }
    });
});

app.post('/recommend', (req, res) => {   // 추천 시스템 처리

    console.log("추천 시스템 처리 실행");
    console.log("req.body : " + JSON.stringify(req.body));
    
    var id = req.body.id;
    console.log("get_id : " + id);

    var tableNames = ["FOOD", "RATING"];
    var queryCommand = [];
    var tables = [];

    for (var i = 0; i < tableNames.length; i++) {
        var command = "SELECT * FROM food_db." + tableNames[i] + ";";
        queryCommand.push(command);
    }

    var callbackFn = function (err, row) {  // callback 함수 설정
        if (!err) {
            tables.push(row);
            runPython(tables);  // python code 실행
        }
    }

    food_db.query(queryCommand[0], (err, row) => {
        if (!err) {
            tables.push(row);
            food_db.query(queryCommand[1], callbackFn); // query 처리 후 callbackFn 실행
        }
    });

    function runPython(datas) {
        var options = {
            mode: 'text',
            pythonPath: '',
            pythonOptions: ['-u'],
            scriptPath: './python',
            // args: ['value1', 'value2', 'value3']
            args : datas
        }

        // tablePrint(tableNames, datas);
        console.log("runPython 함수 실행");
        PythonShell.run('sgd.py', options, function(err, results) {
            if (err) {
                console.log('err :' + err);
                throw err;
            }
            else {
                console.log("python 파일에서 menuList 받아옴");
                console.log(results);

                // console.log("---------------");
                // console.log(results[0]);

                res.send({menuList : results});
            }
        });
    } 
});