module.exports = {

    OK : { "isSuccess": true, "code": 200, "message":"성공" },
    FORBIDDEN : { "isSuccess": false, "code": 403, "message":"해당 권한이 없습니다." },

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    //Request error
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },

    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNUP_REDUNDANT_ID : { "isSuccess": false, "code": 3005, "message":"중복된 아이디입니다." },
    
    REPLY_REDUNDANT_ID : { "isSuccess": false, "code": 3006, "message":"해당 게시물에 이미 댓글을 작성하셨습니다." },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
}
