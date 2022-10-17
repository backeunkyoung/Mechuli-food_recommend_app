module.exports = function(app){
    const food = require('./foodController');

    // 1. 회원가입 페이지 음식 리스트 받아오기
    app.get('/foods/user', food.getUser);

    // 2. 평점 추가(수정)하기 페이지 검색한 음식 리스트 받아오기
    app.get('/foods/result', food.getResult);

    // 3. 평점 추가(수정) 상세 페이지 음식 정보 받아오기
    app.get('/foods/:menuId', food.getFoodMenu);

};