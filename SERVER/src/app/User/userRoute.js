module.exports = function(app){
    const user = require('./userController');

    // 1. 회원가입
    app.put('/users', user.putUsers);

    // 2. 로그인
    app.post('/users', user.postUsers);

    // 3. id 중복 체크
    app.get('/users', user.getUsers);


};