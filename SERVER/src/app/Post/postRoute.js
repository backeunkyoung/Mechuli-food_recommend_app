module.exports = function(app){
    const post = require('./postController');

    // 1. 전체 레시피 리스트 조회
    app.get('/posts', post.getAllPost);

    // 2. 레시피 검색
    app.get('/posts/result', post.getPostResult);

    // 3. 레시피 생성
    app.post('/posts/recipe', post.postRecipe);

    // 4. 레시피 수정
    app.put('/posts/recipe/:recipeId', post.putRecipe);

    // 5. 레시피 삭제
    app.delete('/posts/recipe/:recipeId', post.deleteRecipe);

    // 6. 레시피 조회
    app.get('/posts/recipe/:recipeId', post.getRecipe);

    // 7. 레시피 댓글 생성
    app.post('/posts/recipe/replys', post.postReply);

    // 8. 레시피 댓글 수정
    app.put('/posts/recipe/replys/:replyId', post.putReply);

    // 9. 레시피 댓글 삭제
    app.delete('/posts/recipe/replys/:replyId', post.deleteReply);


};