
// 서버를 띄우기 위한 기본셋팅 (exprss 라이브러리)
const express = require('express');
const app = express();
//
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const MongoClient = require('mongodb').MongoClient;
// ejs
app.set('view engine', 'ejs');
// css
app.use('/Part1/TODOAPP/public', express.static('public'));

// method override
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

require('dotenv').config()


// mongodb+srv://kth0027:<password>@cluster0.lkqof.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

var db;
MongoClient.connect('mongodb+srv://kth0027:xogh0027^^@cluster0.lkqof.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function (에러, client) {
   // 연결되면 할일
   if (에러) return console.log(에러)

   db = client.db('todoapp');
   console.log('저장완료');
   // db.collection('post').insertOne({ 이름: 'john', _id: 100 }, function (에러, 결과) {
   //    console.log('저장완료');
   // });

   app.listen(8080, function () {
      console.log('listening on 8080')
   })
})

// (env 파일을 적용하는 server.js 코드)
// var db;
//   MongoClient.connect(process.env.DB_URL, function(err, client){
//   if (err) return console.log(err)
//   db = client.db('Example1');
//   app.listen(process.env.PORT, function() {
//     console.log('listening on 8080')
//   })
// }) 


// app.listen(8080, function () {
//    console.log('listening on 8080')
// });

// 누군가가 /pet 으로 방문을 하면..
// pet관련된 안내문을 띄워주자


app.get('/', function (요청, 응답) {
   // 응답.sendFile(__dirname + '/index.html')
   응답.render('index.ejs');
});

app.get('/write', function (요청, 응답) {
   // 응답.sendFile(__dirname + '/write.html')
   응답.render('write.ejs');
});




// app.get('/pet', function (요청, 응답) {
//    응답.send('펫용품 쇼핑할 수 있는 페이지입니다.');
// });

// app.get('/beauty', function (요청, 응답) {
//    응답.send('뷰티용품 쇼핑할 수 있는 페이지입니다.');
// });






// #1
// 어떤 사람이 /add 경로로 post 요청을 하면...
// ?? 를 해주세요
app.post('/add', function (요청, 응답) {
   응답.send('전송완료');
   db.collection('counter').findOne({ name: '게시물갯수' }, function (에러, 결과) {
      console.log(결과.totalPost)
      var 총게시물갯수 = 결과.totalPost;

      db.collection('post').insertOne({ _id: 총게시물갯수 + 1, 제목: 요청.body.title, 날짜: 요청.body.date }, function () {
         console.log('저장완료');
         // counter라는 콜렉션에 있는 totalPost 라는 항목도 1 증가시켜야 함 (수정)
         // db.collection('counter').updateOne({수정할 데이터},{수정값},function(){})
         db.collection('counter').updateOne({ name: '게시물갯수' }, { $inc: { totalPost: 1 } }, function (에러, 결과) {
            if (에러) { return console.log(에러) }
         })
      });
   });

});


// #2
// /list 로  get요청으로 접속하면
// 실제DB에 저장된 데이터들로 예쁘게 꾸며진 HTML을 보여줌
app.get('/list', function (요청, 응답) {
   db.collection('post').find().toArray(function (에러, 결과) {
      console.log(결과);
      응답.render('list.ejs', { posts: 결과 });
   })
})

// 삭제
app.delete('/delete', function (요청, 응답) {
   console.log(요청.body);
   요청.body._id = parseInt(요청.body._id);
   // 요청.body 에 담겨온 게시물번호를 가진 글을 db에서 찾아서 삭제해주세요
   db.collection('post').deleteOne(요청.body, function (에러, 결과) {
      console.log('삭제완료');
      응답.status(200).send({ message: '성공했습니다' });
   })
})

// /detail 로 접속하면 detail.ejs 보여줌
app.get('/detail/:id', function (요청, 응답) {
   db.collection('post').findOne({ _id: parseInt(요청.params.id) }, function (에러, 결과) {
      console.log(결과);
      응답.render('detail.ejs', { data : 결과 });
   })

})

// /edit 
app.get('/edit/:id', function (요청,응답){
   // 응답.render('edit.ejs', 파라미터중 :id 번째 게시물 제목/ 날짜)
   db.collection('post').findOne({_id : parseInt(요청.params.id)}, function(에러, 결과){
      console.log(결과)
      응답.render('edit.ejs',{post : 결과})
   })
   
})

app.put('/edit', function(요청, 응답){
   db.collection('post').updateOne( {_id : parseInt(요청.body.id) }, {$set : { 제목 : 요청.body.title , 날짜 : 요청.body.date }}, function(에러, 결과){
      console.log('수정완료')
      응답.redirect('/list')      
   })

})

// session about passport library
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

// app.use(미들웨어) 미들웨어 : 요청-응답 중간에 뭔가 실행되는 코드
app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session()); 

// login
app.get('/login', function(요청,응답){
   응답.render('login.ejs')
});


app.post('/login', passport.authenticate('local', {
   failureRedirect : '/fail'
}), function(요청,응답){
   응답.redirect('/')
});

// 마이페이지
app.get('/mypage', 로그인했니,function(요청,응답){
   요청.user
   console.log(요청.user)
   응답.render('mypage.ejs', {사용자 : 요청.user})
});

function 로그인했니(요청,응답,next) {
   // 로그인 후 세션이 있으면 요청.user가 항상 있음
   if (요청.user) {
      next()
   } else {
      응답.send('로그인 안하셨습니다!')
   }
}

passport.use(new LocalStrategy({
   usernameField: 'id',
   passwordField: 'pw',
   session: true,
   passReqToCallback: false,
 }, function (입력한아이디, 입력한비번, done) {
   //console.log(입력한아이디, 입력한비번);
   db.collection('login').findOne({ id: 입력한아이디 }, function (에러, 결과) {
     if (에러) return done(에러)
 
     if (!결과) return done(null, false, { message: '존재하지않는 아이디요' })
     if (입력한비번 == 결과.pw) {
       return done(null, 결과)
     } else {
       return done(null, false, { message: '비번틀렸어요' })
     }
   })
 }));

// ID를 이용해서 세션을 저장시키는 코드 (로그인 성공시 발동)
 passport.serializeUser(function(user, done) {
   done(null, user.id)
 });

 // 이세션 데잍를 가진 사람을 DB에서 찾아주세요 (마이페이지 접속시)
 passport.deserializeUser(function(아이디, done){
    db.collection('login').findOne({id:아이디}, function(에러,결과){
      done(null, 결과)
    })
  
 });

