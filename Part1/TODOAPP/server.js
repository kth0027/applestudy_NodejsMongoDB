
// 서버를 띄우기 위한 기본셋팅 (exprss 라이브러리)
const express = require('express');
const app = express();
//
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const MongoClient = require('mongodb').MongoClient


// mongodb+srv://kth0027:<password>@cluster0.lkqof.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

var db;
MongoClient.connect('mongodb+srv://kth0027:xogh0027^^@cluster0.lkqof.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function (에러, client) {
   // 연결되면 할일
   if (에러) return console.log(에러)

   db = client.db('todoapp');
   db.collection('post').insertOne({이름 : 'john', _id : 100}, function(에러, 결과){
      console.log('저장완료');
   });

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


// 어떤 사람이 /add 경로로 post 요처응ㄹ 하면...
// ?? 를 해주세요
app.post('/add', function (요청, 응답) {
   응답.send('전송완료')
   console.log(요청.body)
   console.log(요청.body.title)
   console.log(요청.body.date)
});

