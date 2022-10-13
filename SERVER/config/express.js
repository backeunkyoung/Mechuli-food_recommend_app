const express = require('express');
// const compression = require('compression');
// const methodOverride = require('method-override');
// var cors = require('cors');
module.exports = function () {
    const app = express();

    // app.use(compression());

    app.use(express.json());

    // 객체 형태로 전달된 데이터 내에서 또다른 중첩된 객체 허용
    app.use(express.urlencoded({extended: true}));

    // app.put과 app.delete를 사용하기 위함
    // app.use(methodOverride());

    // app.use(cors());
    // app.use(express.static(process.cwd() + '/public'));


    /* App (Android, iOS) */
    // TODO: 도메인을 추가할 경우 이곳에 Route를 추가하세요.
    require('../src/app/User/userRoute')(app);

    return app;
};