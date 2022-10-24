module.exports = function(app){
    const recommend = require('./recommendController');

    // 1. 메뉴 추천받기
    app.get('/recommends/:userId', recommend.getRecommend);

    // 2. 평점 추가(수정)하기
    app.put('/recommends', recommend.putRecommend);


};