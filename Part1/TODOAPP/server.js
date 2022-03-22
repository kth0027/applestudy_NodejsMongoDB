
// 서버를 띄우기 위한 기본셋팅 (exprss 라이브러리)
const express = require('express');
const app = express();
//
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const MongoClient = require('mongodb').MongoClient;
// ejs
app.set('view engine', 'ejs');



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


// app.listen(8080, function () {
//    console.log('listening on 8080')
// });

// 누군가가 /pet 으로 방문을 하면..
// pet관련된 안내문을 띄워주자


app.get('/', function (요청, 응답) {
   응답.sendFile(__dirname + '/index.html')
});

app.get('/pet', function (요청, 응답) {
   응답.send('펫용품 쇼핑할 수 있는 페이지입니다.');
});

app.get('/beauty', function (요청, 응답) {
   응답.send('뷰티용품 쇼핑할 수 있는 페이지입니다.');
});

app.get('/write', function (요청, 응답) {
   응답.sendFile(__dirname + '/write.html')
});





// #1
// 어떤 사람이 /add 경로로 post 요청을 하면...
// ?? 를 해주세요
app.post('/add', function(요청, 응답){
   응답.send('전송완료');
   db.collection('counter').findOne({name : '게시물갯수'}, function(에러, 결과){
      console.log(결과.totalPost)
     var 총게시물갯수 = 결과.totalPost;
     
     db.collection('post').insertOne( { _id : 총게시물갯수 + 1, 제목 : 요청.body.title, 날짜 : 요청.body.date } , function(){
       console.log('저장완료');
      // counter라는 콜렉션에 있는 totalPost 라는 항목도 1 증가시켜야 함 (수정)
         // db.collection('counter').updateOne({수정할 데이터},{수정값},function(){})
         db.collection('counter').updateOne({name:'게시물갯수'},{$inc : {totalPost :1} },function(에러, 결과){
            if(에러){return console.log(에러) }
         })
     });
   });
   
 });


// #2
// /list 로  get요청으로 접속하면
// 실제DB에 저장된 데이터들로 예쁘게 꾸며진 HTML을 보여줌
app.get('/list', function(요청, 응답){
   db.collection('post').find().toArray(function(에러, 결과){
     console.log(결과)
     응답.render('list.ejs', { posts : 결과 })
   })
 })

