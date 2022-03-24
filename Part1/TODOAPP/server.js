
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


// socket
const http = require('http').createServer(app);
const { Server, Socket } = require("socket.io");
const io = new Server(http);


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

   app.db = db;

   // app.listen(8080, function () {
   http.listen(8080, function () {
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



// #2
// /list 로  get요청으로 접속하면
// 실제DB에 저장된 데이터들로 예쁘게 꾸며진 HTML을 보여줌
app.get('/list', function (요청, 응답) {
   db.collection('post').find().toArray(function (에러, 결과) {
      console.log(결과);
      응답.render('list.ejs', { posts: 결과 });
   })
})

// /detail 로 접속하면 detail.ejs 보여줌
app.get('/detail/:id', function (요청, 응답) {
   db.collection('post').findOne({ _id: parseInt(요청.params.id) }, function (에러, 결과) {
      console.log(결과);
      응답.render('detail.ejs', { data: 결과 });
   })

})

// /edit 
app.get('/edit/:id', function (요청, 응답) {
   // 응답.render('edit.ejs', 파라미터중 :id 번째 게시물 제목/ 날짜)
   db.collection('post').findOne({ _id: parseInt(요청.params.id) }, function (에러, 결과) {
      console.log(결과)
      응답.render('edit.ejs', { post: 결과 })
   })

})

app.put('/edit', function (요청, 응답) {
   db.collection('post').updateOne({ _id: parseInt(요청.body.id) }, { $set: { 제목: 요청.body.title, 날짜: 요청.body.date } }, function (에러, 결과) {
      console.log('수정완료')
      응답.redirect('/list')
   })

})

// session about passport library
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

// app.use(미들웨어) 미들웨어 : 요청-응답 중간에 뭔가 실행되는 코드
app.use(session({ secret: '비밀코드', resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// login
app.get('/login', function (요청, 응답) {
   응답.render('login.ejs')
});


app.post('/login', passport.authenticate('local', {
   failureRedirect: '/fail'
}), function (요청, 응답) {
   응답.redirect('/')
});

// 마이페이지
app.get('/mypage', 로그인했니, function (요청, 응답) {
   요청.user
   console.log(요청.user)
   응답.render('mypage.ejs', { 사용자: 요청.user })
});

function 로그인했니(요청, 응답, next) {
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
passport.serializeUser(function (user, done) {
   done(null, user.id)
});

// 이세션 데잍를 가진 사람을 DB에서 찾아주세요 (마이페이지 접속시)
passport.deserializeUser(function (아이디, done) {
   db.collection('login').findOne({ id: 아이디 }, function (에러, 결과) {
      done(null, 결과)
   })
});

// 회원가입
app.post('/register', function (요청, 응답) {
   db.collection('login').insertOne({ id: 요청.body.id, pw: 요청.body.pw }, function (에러, 결과) {
      응답.redirect('/');
   })
})



// search
// app.get('/search', (요청, 응답) => {
//    console.log(요청.query.value)
//    // {object자료} 데이터 꺼냄

//    // 검색만 찾기
//    db.collection('post').find({ 제목: 요청.query.value }).toArray((에러, 결과) => {
//       console.log(결과)
//       응답.render('search.ejs', { posts: 결과 })
//    })
// })

// app.get('/search', (요청, 응답) => {
//    console.log(요청.query.value)
//    // 검색포함 찾기
//    db.collection('post').find({ $text : { $search: 요청.query.value }}).toArray((에러, 결과)=>{
//       console.log(결과)
//       응답.render('search.ejs', {posts : 결과})
//     })
// })

app.get('/search', (요청, 응답) => {

   var 검색조건 = [
      {
         $search: {
            index: 'titleSearch', //'님이만든인덱스명'
            text: {
               query: 요청.query.value,
               path: '제목'  // 제목날짜 둘다 찾고 싶으면 ['제목', '날짜']
            }
         }
      },
      { $sort: { _id: 1 } }, // 1 or -1
      { $limit: 10 }, // 검색량 제한
      { $project: { 제목: 1, _id: 1, 날짜: 1, socre: { $meta: "searchScore" } } } // 보여주고싶은 결과값 설정 (0 안가져옴 // 1 가져옴)
   ]
   console.log(요청.query);
   db.collection('post').aggregate(검색조건).toArray((에러, 결과) => {
      console.log(결과)
      응답.render('search.ejs', { posts: 결과 })
   })
})

// #1
// 어떤 사람이 /add 경로로 post 요청을 하면...
// ?? 를 해주세요
app.post('/add', function (요청, 응답) {
   응답.send('전송완료');
   db.collection('counter').findOne({ name: '게시물갯수' }, function (에러, 결과) {
      console.log(결과.totalPost)
      var 총게시물갯수 = 결과.totalPost;
      var 저장할거 = { _id: 총게시물갯수 + 1, 제목: 요청.body.title, 날짜: 요청.body.date, 작성자: 요청.user._id }

      db.collection('post').insertOne(저장할거, function (에러, 결과) {
         console.log('저장완료');
         // counter라는 콜렉션에 있는 totalPost 라는 항목도 1 증가시켜야 함 (수정)
         // db.collection('counter').updateOne({수정할 데이터},{수정값},function(){})
         db.collection('counter').updateOne({ name: '게시물갯수' }, { $inc: { totalPost: 1 } }, function (에러, 결과) {
            if (에러) { return console.log(에러) }
         })
      });
   });
});

// 삭제
app.delete('/delete', function (요청, 응답) {
   console.log('삭제요청들어옴')
   console.log(요청.body);
   요청.body._id = parseInt(요청.body._id);

   // 로그인 id를 추가해줌으로 조건추가
   var 삭제할데이터 = { _id: 요청.body._id, 작성자: 요청.user._id }

   // 요청.body 에 담겨온 게시물번호를 가진 글을 db에서 찾아서 삭제해주세요
   db.collection('post').deleteOne(삭제할데이터, function (에러, 결과) {
      console.log('삭제완료');
      if (에러) { console.log(에러) }
      응답.status(200).send({ message: '성공했습니다' });
   })
})

// route 삽입
// app.use('/', require('./routes/shop.js'));
app.use('/shop', require('./routes/shop.js'));
app.use('/board/sub', require('./routes/board.js'));



// 이미지 업로드
let multer = require('multer');
var storage = multer.diskStorage({

   destination: function (req, file, cb) {
      cb(null, './public/image')
   },
   filename: function (req, file, cb) {
      cb(null, file.originalname)
      // 파일명 다이나믹하게
      // cb(null, file.originalname + '날짜' + new Date() )
   },
   // 업로드전 제재 하기 (파일형식 확장자 거르기)
   filefilter: function (req, file, cb) {

   },
   // 제한
   //    limits:{
   //       fileSize: 1024 * 1024
   //   }

});

var upload = multer({ storage: storage });

// 업로드한 파일의 확장자 필터로 원하는 파일만 거르는 법
// var path = require('path');

// var upload = multer({
//     storage: storage,
//     fileFilter: function (req, file, callback) {
//         var ext = path.extname(file.originalname);
//         if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
//             return callback(new Error('PNG, JPG만 업로드하세요'))
//         }
//         callback(null, true)
//     },
//     limits:{
//         fileSize: 1024 * 1024
//     }
// });


app.get('/upload', function (요청, 응답) {
   응답.render('upload.ejs')
});

// 단일파일
app.post('/upload', upload.single('프로필'), function (요청, 응답) {
   // 여러개파일
   // app.post('/upload', upload.array('프로필', 10), function (요청, 응답) {
   응답.send('업로드완료')
});

// 업로드 이미지 보여주기
app.get('/image/:imageName', function (요청, 응답) {
   응답.sendFile(__dirname + '/public/image/' + 요청.params.imageName)
})

{/* <img src="/Part1/TODOAPP/public/image/food1.jpg" alt="" /> */ }



// chatroom

const { ObjectId } = require('mongodb');
app.post('/chatroom', function (요청, 응답) {

   var 저장할거 = {
      title: '무슨무슨채팅방',
      member: [ObjectId(요청.body.당한사람id), 요청.user._id],
      date: new Date()
   }

   db.collection('chatroom').insertOne(저장할거).then((결과) => {
      응답.send('저장완료')
   });
});

//  내가속한 채팅방 게시물도 보여줘야함
app.get('/chat', 로그인했니, function (요청, 응답) {

   db.collection('chatroom').find({ member: 요청.user._id }).toArray().then((결과) => {
      console.log(결과);
      응답.render('chat.ejs', { data: 결과 })
   })

});

app.post('/message', 로그인했니, function (요청, 응답) {
   var 저장할거 = {
      parent: 요청.body.parent,
      content: 요청.body.content,
      userid: 요청.user._id,
      date: new Date(),
   }
   db.collection('message').insertOne(저장할거).then(() => {
      console.log('DB저장성공');
      응답.send('DB저장성공');
   })
});


// 서버와 유저간 실시간 소통채널 열기
// http 요청시 몰래 전달되는 정보들도 있음
// (유저의 언어, 브라우저 정보, 가진 쿠키, 어디서왔나)
// 이런정보는Header라는공간 안에 담겨있음


app.get('/message/:id', 로그인했니, function (요청, 응답) {

   // 헤더를 수정해주세요
   // 서버 => 유저 전달되는 Header를 이렇게 바꾸면 실시간 채널 개설됨
   응답.writeHead(200, {
      "Connection": "keep-alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
   });

   // 유저에게 데이터 전송은 event : 보낼데이터이름\n
   // 유저에게 데이터 전송은 data : 보낼데이터이름\n\n
   // (참고)서버에서 실시간 전송 시 문자자료만 전송가능
   db.collection('message').find({ parent: 요청.params.id }).toArray().then((결과) => {
      응답.write('event: test\n');
      응답.write('data: ' + JSON.stringify(결과) + '\n\n');
      // object, array에 따옴표치면 => json 입니다. (json은 문자취급 안받는다)
   })

   // Change Stream 설정법
   const pipeline = [
      { $match: { 'fullDocument.parent': 요청.params.id } }
   ];

   const collection = db.collection('message');
   const changeStream = collection.watch(pipeline);

   changeStream.on('change', (result) => {
      console.log(result.fullDocument);
      응답.write('event : test\n');
      응답.write('data : ' + JSON.stringify([result.fullDocument]) + '\n\n');
   });

});

// socket 채팅방
app.get('/socket', function (요청, 응답) {
   응답.render('socket.ejs')
})

io.on('connection', function (socket) {
   console.log('유지접속됨');

   // 유저구분시
   console.log(socket.id);
   socket.on('user-send', function (data) {
      console.log(data);
      io.emit('broadcast', data)  //모든사람에게 데이터 전송

      // 서버 - 유저1명간
      // io.to(socket.id).emit('broadcast', data)  //한사람에게 데이터 전송
   });

   // 채팅방1 입장
   socket.on('joinroom', function(data){
      socket.join('room1');
    });
  
    socket.on('room1-send', function(data){
      io.to('room1').emit('broadcast', data);
    });

});
