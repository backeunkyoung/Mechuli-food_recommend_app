// 서버 실행은 해당 경로 터미널에서 node server.js 입력
const express = require('express');
const { fstat } = require('fs');
const app = express();
const port = 3333;
const xlsx = require('xlsx')
const fs = require('fs')
const food_db = require('./DB/food_db');
const { json } = require('body-parser');
const { Console } = require('console');

const PythonShell = require('python-shell').PythonShell;

app.use(express.json());
app.use(express.urlencoded({extended : true}));

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
                        // console.log(resultList);
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
    var age = req.body.age;
    var sex = req.body.sex;
    var signUpRatings = req.body.signUpRatings

    var regex = /[^0-9]/gi;
    age = age.replace(regex, "");
    // console.log("age : " + age);

    var intSex;
    if (sex == "남자") {
        intSex= "1";
    }
    else if (sex == "여자") {
        intSex = "2";
    }
    // console.log("intSex : " + intSex);

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

                            var query = "INSERT INTO food_db.RATING(userid, foodid, rating) VALUES (" + id + ", " + foodId + ", " + foodRating + ");";
                            food_db.query(query, function (err, row) {  // insert rating data
                                if (!err) {
                                    // console.log(count + " : rating 정보 등록 성공");
                                    count++;
                                    if (count == originMap.size) {
                                        var query = "INSERT INTO food_db.USERINFO(`user_ID`,`user_PASSWORD`)VALUES('" + id + "','" + pw + "')";
                                        food_db.query(query, function (err, row) {
                                            if (!err) {
                                                console.log("회원가입 성공");

                                                var query = "INSERT INTO food_db.user_random_data(user_ID, sex, age, age_group)VALUES('" + id + "', '" + intSex + "', '" + age + "', 0);";
                                                food_db.query(query, function (err, row) {
                                                    if (!err) {
                                                        console.log("사용자 정보 등록 성공");
                                                        res.send({result : true});
                                                    }
                                                });
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
                // console.log(JSON.stringify(row));
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
    console.log("--------- 추천 시스템 처리 실행 ---------");
    console.log("req.body : " + JSON.stringify(req.body));
    
    var id = req.body.id;
    console.log("get_id : " + id);

    var tableFoodQuery = "SELECT * FROM food_db.FOOD;";
    food_db.query(tableFoodQuery, (err, row) => {   // FOOD
        if (!err) {
            // tables.push(row);
            var fileData = row;
            var ws = xlsx.utils.json_to_sheet(fileData)
            const stream = xlsx.stream.to_csv(ws, {FS:","})

            stream.pipe(fs.createWriteStream('./python/csv/food.csv'))

            var tableRATINGQuery = "SELECT * FROM food_db.RATING;";
            food_db.query(tableRATINGQuery, (err, row) => { // RATING
                if (!err) {
                    var fileData = row;
                    var ws = xlsx.utils.json_to_sheet(fileData)
                    const stream = xlsx.stream.to_csv(ws, {FS:","})

                    stream.pipe(fs.createWriteStream('./python/csv/rating.csv'))

                    var tableUSERINFOQuery = "SELECT * FROM food_db.user_random_data;";
                    food_db.query(tableUSERINFOQuery, (err, row) => { // user_random_data
                        if (!err) {
                            var fileData = row;
                            var ws = xlsx.utils.json_to_sheet(fileData)
                            const stream = xlsx.stream.to_csv(ws, {FS:","})

                            stream.pipe(fs.createWriteStream('./python/csv/userRanDomData.csv'));

                            var tableAGE_SEX_WEIGHTQuery = "SELECT * FROM food_db.AGE_SEX_WEIGHT;";
                            food_db.query(tableAGE_SEX_WEIGHTQuery, (err, row) => { // AGE_SEX_WEIGHT
                                if (!err) {
                                    var fileData = row;
                                    var ws = xlsx.utils.json_to_sheet(fileData)
                                    const stream = xlsx.stream.to_csv(ws, {FS:","})

                                    stream.pipe(fs.createWriteStream('./python/csv/ageSexWeight.csv'));

                                    var tableindividual_weightQuery = "SELECT * FROM food_db.individual_weight;";
                                    food_db.query(tableindividual_weightQuery, (err, row) => { // individual_weight
                                        if (!err) {
                                            var fileData = row;
                                            var ws = xlsx.utils.json_to_sheet(fileData)
                                            const stream = xlsx.stream.to_csv(ws, {FS:","})

                                            stream.pipe(fs.createWriteStream('./python/csv/individualWeight.csv'));

                                            var tableWEIGHTQuery = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='individual_weight';";
                                            food_db.query(tableWEIGHTQuery, (err, row) => { // COLUMN_NAME food_tag
                                                if (!err) {
                                                    var fileData = [];
                                                    var count = 0;
                                                    for (var data of row) {
                                                        var ob = new Object();

                                                        if (count == 0) {
                                                            count++;
                                                        }
                                                        else {
                                                            ob.food_tag = data.COLUMN_NAME;
                                                            fileData.push(ob);
                                                        }
                                                    }
                                                    
                                                    var ws = xlsx.utils.json_to_sheet(fileData)
                                                    const stream = xlsx.stream.to_csv(ws, {FS:","})

                                                    stream.pipe(fs.createWriteStream('./python/csv/foodTag.csv'));

                                                    runPython();
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });

    function runPython() {
        var options = {
            mode: 'text',
            pythonPath: '',
            pythonOptions: ['-u'],
            scriptPath: './python',
            // args: ['value1', 'value2', 'value3']
            args : id,
            encoding : 'utf8'
        }

        // tablePrint(tableNames, datas);
        console.log("runPython 함수 실행, id : " + id);
        PythonShell.run('main.py', options, function(err, results) {
            if (err) {
                console.log("err : " + err);
            } else {
                console.log("python 파일에서 menuList 받아옴");

                console.log(results);

                // console.log("------- getData --------");
                // console.log(results[0]);
                var getData = results[0];
                var dataStr = getData.substring(1, getData.length-1);
                foodIdArr = dataStr.split(", ");
                // console.log(foodIdArr);

                var selectQuery = [];
                for (var i = 0; i < foodIdArr.length; i++) {
                    var fId = foodIdArr[i];
                    // console.log("fId : " + fId);
                    var q = "SELECT * FROM food_db.FOOD WHERE foodid = '" + fId + "';";
                    selectQuery.push(q);
                }

                var resultList = [];
                food_db.query(selectQuery[0], (err, row) => {
                    if (!err) {
                        for (var data of row) {
                            var fId = data.foodid;

                            var ob = new Object();
                            ob.foodname = data.foodname;
                            ob.image_1 = data.image_1;
                            ob.image_2 = data.image_2;
                            ob.type_1 = data.type_1;

                            var q = "SELECT EXISTS (SELECT * FROM food_db.RATING WHERE userid = '" + id + "' AND foodid = '" + fId + "' limit 1) as success;";
                            food_db.query(q, (err, row) => {
                                if (!err) {
                                    for (var data of row) {
                                        checking = data.success;
                
                                        if (checking == 1) {  
                                            var getRatingQuery = "SELECT * FROM food_db.RATING WHERE userid = '" + id + "' AND foodid = '" + fId + "';";
                                            food_db.query(getRatingQuery, (err, row) => {
                                                if (!err) {
                                                    for (var data of row) {
                                                        var ratingData = data.rating;
                                                        ob.rating = parseFloat(ratingData);
                                                    }
                                                }
                                            });
                                        }
                                        else {
                                            ob.rating = 0.0;
                                        }
                                        resultList.push(ob);

                                        food_db.query(selectQuery[1], (err, row) => {
                                            if (!err) {
                                                for (var data of row) {
                                                    var fId = data.foodid;
                        
                                                    var ob = new Object();
                                                    ob.foodname = data.foodname;
                                                    ob.image_1 = data.image_1;
                                                    ob.image_2 = data.image_2;
                                                    ob.type_1 = data.type_1;
                        
                                                    var q = "SELECT EXISTS (SELECT * FROM food_db.RATING WHERE userid = '" + id + "' AND foodid = '" + fId + "' limit 1) as success;";
                                                    food_db.query(q, (err, row) => {
                                                        if (!err) {
                                                            for (var data of row) {
                                                                checking = data.success;
                                        
                                                                if (checking == 1) {  
                                                                    var getRatingQuery = "SELECT * FROM food_db.RATING WHERE userid = '" + id + "' AND foodid = '" + fId + "';";
                                                                    food_db.query(getRatingQuery, (err, row) => {
                                                                        if (!err) {
                                                                            for (var data of row) {
                                                                                var ratingData = data.rating;
                                                                                ob.rating = parseFloat(ratingData);
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                                else {
                                                                    ob.rating = 0.0;
                                                                }
                                                                resultList.push(ob);

                                                                food_db.query(selectQuery[2], (err, row) => {
                                                                    if (!err) {
                                                                        for (var data of row) {
                                                                            var fId = data.foodid;
                                                
                                                                            var ob = new Object();
                                                                            ob.foodname = data.foodname;
                                                                            ob.image_1 = data.image_1;
                                                                            ob.image_2 = data.image_2;
                                                                            ob.type_1 = data.type_1;
                                                
                                                                            var q = "SELECT EXISTS (SELECT * FROM food_db.RATING WHERE userid = '" + id + "' AND foodid = '" + fId + "' limit 1) as success;";
                                                                            food_db.query(q, (err, row) => {
                                                                                if (!err) {
                                                                                    for (var data of row) {
                                                                                        checking = data.success;
                                                                
                                                                                        if (checking == 1) {  
                                                                                            var getRatingQuery = "SELECT * FROM food_db.RATING WHERE userid = '" + id + "' AND foodid = '" + fId + "';";
                                                                                            food_db.query(getRatingQuery, (err, row) => {
                                                                                                if (!err) {
                                                                                                    for (var data of row) {
                                                                                                        var ratingData = data.rating;
                                                                                                        ob.rating = parseFloat(ratingData);
                                                                                                    }
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                        else {
                                                                                            ob.rating = 0.0;
                                                                                        }
                                                                                        resultList.push(ob);

                                                                                        food_db.query(selectQuery[3], (err, row) => {
                                                                                            if (!err) {
                                                                                                for (var data of row) {
                                                                                                    var fId = data.foodid;
                                                                        
                                                                                                    var ob = new Object();
                                                                                                    ob.foodname = data.foodname;
                                                                                                    ob.image_1 = data.image_1;
                                                                                                    ob.image_2 = data.image_2;
                                                                                                    ob.type_1 = data.type_1;
                                                                        
                                                                                                    var q = "SELECT EXISTS (SELECT * FROM food_db.RATING WHERE userid = '" + id + "' AND foodid = '" + fId + "' limit 1) as success;";
                                                                                                    food_db.query(q, (err, row) => {
                                                                                                        if (!err) {
                                                                                                            for (var data of row) {
                                                                                                                checking = data.success;
                                                                                        
                                                                                                                if (checking == 1) {  
                                                                                                                    var getRatingQuery = "SELECT * FROM food_db.RATING WHERE userid = '" + id + "' AND foodid = '" + fId + "';";
                                                                                                                    food_db.query(getRatingQuery, (err, row) => {
                                                                                                                        if (!err) {
                                                                                                                            for (var data of row) {
                                                                                                                                var ratingData = data.rating;
                                                                                                                                ob.rating = parseFloat(ratingData);
                                                                                                                            }
                                                                                                                        }
                                                                                                                    });
                                                                                                                }
                                                                                                                else {
                                                                                                                    ob.rating = 0.0;
                                                                                                                }
                                                                                                                resultList.push(ob);

                                                                                                                food_db.query(selectQuery[4], (err, row) => {
                                                                                                                    if (!err) {
                                                                                                                        for (var data of row) {
                                                                                                                            var fId = data.foodid;
                                                                                                
                                                                                                                            var ob = new Object();
                                                                                                                            ob.foodname = data.foodname;
                                                                                                                            ob.image_1 = data.image_1;
                                                                                                                            ob.image_2 = data.image_2;
                                                                                                                            ob.type_1 = data.type_1;
                                                                                                
                                                                                                                            var q = "SELECT EXISTS (SELECT * FROM food_db.RATING WHERE userid = '" + id + "' AND foodid = '" + fId + "' limit 1) as success;";
                                                                                                                            food_db.query(q, (err, row) => {
                                                                                                                                if (!err) {
                                                                                                                                    for (var data of row) {
                                                                                                                                        checking = data.success;
                                                                                                                
                                                                                                                                        if (checking == 1) {  
                                                                                                                                            var getRatingQuery = "SELECT * FROM food_db.RATING WHERE userid = '" + id + "' AND foodid = '" + fId + "';";
                                                                                                                                            food_db.query(getRatingQuery, (err, row) => {
                                                                                                                                                if (!err) {
                                                                                                                                                    for (var data of row) {
                                                                                                                                                        var ratingData = data.rating;
                                                                                                                                                        ob.rating = parseFloat(ratingData);
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            });
                                                                                                                                        }
                                                                                                                                        else {
                                                                                                                                            ob.rating = 0.0;
                                                                                                                                        }
                                                                                                                                        resultList.push(ob);
                                                                                                
                                                                                                                                        // console.log(resultList);
                                                                                                                                        console.log("추천 리스트 전송 완료");
                                                                                                                                        res.send({menuList : resultList});
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            });
                                                                                                                        }
                                                                                                                    }
                                                                                                                });
                                                                                                            }
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                }
                                                                            });
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    } 
});

app.post('/randomRecommend', (req, res) => {   // 랜덤으로 추천
    console.log("--------- 랜덤으로 추천 실행 ---------");
    
    var resultList = [];
    var query = "SELECT * FROM food_db.FOOD ORDER BY RAND() LIMIT 5;";
    food_db.query(query, (err, row) => {
        if (!err) {
            // console.log(JSON.stringify(row));
            for (var data of row) {
                var ob = new Object();
                ob.foodname = data.foodname;
                ob.type_1 = data.type_1;
                ob.type_2 = data.type_2;
                ob.image_1 = data.image_1;
                ob.image_2 = data.image_2;

                resultList.push(ob);
            }
            
            // console.log(resultList);
            console.log("random List 전송 완료");
            res.send({menuList : resultList});
        }
    });
});