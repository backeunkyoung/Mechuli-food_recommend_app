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

    // var id = req.body.id;
    var id = "0";
    var keyWord = "나";
  
    var resultList = [];
    var obList = [];
    var rateQueryList = [];
    var count = 0;

    function sendData(getList) {
        for (var i = 0; i < getList.length; i++) {
            var name = getList[i].foodname;
            var img_1 = getList[i].image_1;
            var img_2 = getList[i].image_2;
            var rating = getList[i].rating;

            var ob = new Object();
            ob.foodname = name
            ob.image_1 = img_1
            ob.image_2 = img_2
            ob.rating = rating;

            resultList.push(ob);
        }
        console.log("resultList : " + JSON.stringify(resultList));

        // send
        res.send({menuList : resultList});
    }

    var getRateFn = function (err, row) {
        if (!err) {
            var foodid;
            var rating;
            var foodname;

            if (row.length != 0) {
                for (var data of row) {
                    foodid = data.foodid;
                    rating = parseFloat(data.rating);
    
                    for (var i = 0; i < obList.length; i++) {
                        if (obList[i].foodid == foodid) {
                            obList[i].rating = rating;
                            foodname = obList[i].foodname;
                        }
                    }
                }
                console.log("foodid : " + foodid + ", foodname : " + foodname + ", rating : " + rating);
            }

            count++;
            if (count == obList.length) {
                sendData(obList)
            }
        }
    }
    
    // 키워드로 FOOD에서 메뉴 검색
    var KeywordQuery = "SELECT * FROM food_db.FOOD WHERE foodname LIKE '%" + keyWord + "%';";
    food_db.query(KeywordQuery, function (err, row) {
        if (!err) {
            // console.log(JSON.stringify(row));
            for (var data of row) {
                // 메뉴 리스트에서 foodid, foodname, image_1, image_2 추출
                // console.log(data.foodid + " , " + data.foodname + " , " + data.image_1 + " , " + data.image_2);

                var ob = new Object();
                ob.foodid = data.foodid;
                ob.foodname = data.foodname;
                ob.image_1 = data.image_1;
                ob.image_2 = data.image_2;
                ob.rating = 0.0;

                obList.push(ob);

                if (obList.length == row.length) {
                    for (var i = 0; i < obList.length; i++) {
                        var q = "SELECT * FROM food_db.RATING WHERE userid = '" + id + "' AND foodid = '" + obList[i].foodid + "';";
                        rateQueryList.push(q);
                    }
                    // console.log(rateQueryList);

                    for (var i = 0; i < rateQueryList.length; i++) {
                        food_db.query(rateQueryList[i], getRateFn);
                    }
                }
            }
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

    var options = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: './python',
        // args: ['value1', 'value2', 'value3']
        args : datas
    }

    function runPython(datas) {
        // tablePrint(tableNames, datas);
        console.log("runPython 함수 실행");
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