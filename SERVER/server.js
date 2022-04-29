// 서버 실행은 해당 경로 터미널에서 node server.js 입력
const express = require('express');
const app = express();
const port = 3333;
const users_db = require('./DB/users_db');

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.listen(port, ()=>{  // 서버 실행 확인
    console.log(`express is running on ${port}`);
});

app.post('/idCheck', (req, res) => {   // id 중복 체크
    console.log("id 중복 체크 실행");
    console.log("req.body : " + JSON.stringify(req.body));

    var id = req.body.id;

    console.log("get_id : " + id);

    var query = "SELECT EXISTS (SELECT * FROM users.user_information_table WHERE user_id='" + id + "' limit 1) as success";

    users_db.query(query, function (err, row) {
        if (err) {
            console.log('err : ' + err);
            // res.send({result : "fail"});
        }
        else {
            console.log("중복 체크 완료, " + JSON.stringify(row));
            
            console.log("row.success : " + row[0].success);

            var val = parseInt(row[0].success);

            if (val == 1) { // 사용 불가
                console.log("사용 불가");
                res.send({result : false});
            }
            else {  // 사용 가능
                console.log("사용 가능");
                res.send({result : true});
            }
        }
    })

});

app.post('/registration', (req, res) => {   // 회원가입 처리
    console.log("회원가입 처리 실행");
    console.log("req.body : " + JSON.stringify(req.body));
    
    var id = req.body.id;
    var pw = req.body.pw;

    console.log("get_id : " + id + ", get_pw : " + pw);

    var query = "INSERT INTO users.user_information_table(`user_id`,`user_pw`)VALUES('" + id + "','" + pw + "')";

    users_db.query(query, function (err, row) {
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

    // var query = "select id from movies_db.users where id= '" + id + "';";

    // db.query(query, function (err, row) {
    //     if (err) {
    //         console.log('err :' + err);
    //     } else {
    //         console.log("id query문 결과 : " + JSON.stringify(row));
    //         if (row.length === 0 ) {    // 검색 결과가 0이면 등록 x
    //             console.log("등록되지 않은 id 입니다.");
    //             res.send({nic_name : undefined, msg:"id_fail"}); // 클라이언트(login.html) 쪽으로 전달
    //         } else {
    //             query = "select pw from movies_db.users where id= '" + id + "';";
    //             db.query(query, function (err, row) {
    //                 console.log("pw query문 결과 : " + JSON.stringify(row));
    //                 if (row[0].pw !== pw) {
    //                     console.log("비교한 pw : " + pw);
    //                     console.log("잘못된 비밀번호 입니다.");
    //                     res.send({nic_name : undefined, msg:"pw_fail"});
    //                 } else {
    //                     console.log("로그인에 성공하셨습니다.");
    //                     query = "select nic_name from movies_db.users where id= '" + id + "';";
    //                     db.query(query, function (err, row) {
    //                         console.log("nic_name query문 결과 : " + JSON.stringify(row));
    //                         res.send({nic_name : row[0].nic_name, msg:"success"});
    //                     })
    //                 }
    //             })
    //         }
    //     }
    // });
});
