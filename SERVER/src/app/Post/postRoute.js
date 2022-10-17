module.exports = function(app){
    const post = require('./postController');

    // // 1. 전체 레시피 리스트 조회
    // app.get('/posts', post.putUsers);

    // // 2. 내가 작성한 레시피 리스트 조회
    // app.get('/posts/{userId}', post.putUsers);

    // // 3. 레시피 검색
    // app.get('/posts/result', post.putUsers);

    // 4. 레시피 생성
    app.post('/posts/recipe', post.postRecipe);

    // 5. 레시피 수정
    app.put('/posts/recipe/:recipeId', post.putRecipe);

    // 6. 레시피 삭제
    app.delete('/posts/recipe/:recipeId', post.deleteRecipe);

    // // 7. 레시피 조회
    // app.get('/posts/recipe/{recipeId}', post.getRecipe);


};