// require('파일경로') / require('라이브러리명') : 가져다쓰겠다.
var router = require('express').Router();


// 로그인 공통적용
function 로그인했니(요청, 응답, next) {
    // 로그인 후 세션이 있으면 요청.user가 항상 있음
    if (요청.user) {
       next()
    } else {
       응답.send('로그인 안하셨습니다!')
    }
 }

 // 공통적용
//  router.use(로그인했니);

// 부분적용
 router.use('/shirts', 로그인했니);

// require('/shop.js');

// router.get('/shop/shirts', function(요청, 응답) {
//     응답.send('셔츠 파는 페이지입니다.');
// });

// router.get('/shop/pants', function(요청, 응답) {
//     응답.send('바지 파는 페이지입니다.');
// });

router.get('/shirts',function(요청, 응답) {
    응답.send('셔츠 파는 페이지입니다.');
});

router.get('/pants',function(요청, 응답) {
    응답.send('바지 파는 페이지입니다.');
});

// 내보낼 변수명
module.exports = router;
