const express = require('express');
const app = express();
const port = 3333;
const db = require('./DB/db');

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.listen(port, ()=>{  // 서버 실행 확인
    console.log(`express is running on ${port}`);
});

// app.post('/registration', (req, res) => {   // 회원가입 처리
//     console.log("서버 실행 됨");
//     console.log("req.body : " + JSON.stringify(req.body));
    
//     var id = req.body.postId;
//     var pw = req.body.postPw;
//     var nic_name = req.body.postNicName;
//     var age = req.body.postAge;
    
//     console.log("get_id : " + id + ", get_pw : " + pw + ", get_nic_name : " + nic_name + ", get_age : " + age);

//     var query = "insert into movies_db.users(`id`,`pw`,`nic_name`,`age`)VALUES('" + id + "','" + pw + "','" + nic_name + "','" + age + "')";

//     db.query(query, function (err, row) {
//         if (err) {
//             console.log('err : ' + err);
//         }
//         else {
//             res.send({msg : "success"});
//             console.log("회원가입 성공");
//         }
//     })
// });

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
