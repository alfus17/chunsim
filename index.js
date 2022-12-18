const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}))
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
var db;

const MongoClient = require('mongodb').MongoClient
app.set('view engine', 'ejs');
// 몽고db 주소 변경하면 안됨
MongoClient.connect("mongodb+srv://labos:hallym@cluster0.ynyqmmv.mongodb.net/?retryWrites=true&w=majority", function(err, client){
  if (err) return console.log(err)
     db = client.db('nodejs');

    console.log('DB connected')

  app.listen(8080, function() {
    console.log('listening on 8080')
  })
})

// Session 방식 로그인 기능 구현을 위한 라이브러리 연결
// req와 res사이의 미들웨어로 등록하기
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
app.use(session({ secret: "비밀코드", resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


//api 설정칸

// 기본 폴더 설청
app.use(express.static("./public"));
// index.html 페이지 출력
app.get('/', function(req, res) {
  res.sendFile(__dirname +'/index.html')
  })


// 
app.get('/write', function(req, res) {
    res.sendFile(__dirname +'/write.html')
  })

app.get('/list', function(req, res) {
  db.collection('text').find().toArray(function(err, result){
    console.log(result);
    res.render('list.ejs', {loginfo : result})
  })
})
// app.get('/login', function(req, res) {
//   res.sendFile(__dirname +'/login.html')
// })

// app.post('/login', passport.authenticate('local', {failureRedirect : '/fail'}), function(req, res){
//   res.redirect('/')
// });
// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "id", // form의 name이 id 인 것이 username
//       passwordField: "pw", // form의 name이 pw 인 것이 password
//       session: true, // session을 저장할 것인지
//       passReqToCallback: false, // id/pw 외에 다른 정보 검증 시
//     },
//     function (inputID, inputPW, done) {
//       db.collection("login").findOne({ id: inputID }, function (err, result) {
//         if (err) return done(err);

//         // done 문법 (서버에러, 성공시 사용자 DB, 에러메세지)
//         if (!result)
//           return done(null, false, { message: "존재하지 않는 아이디 입니다." });
//         // 현재 암호화가 전혀 되어있지 않은 상태이기에 추후 변경 필요
//         if (inputPW == result.pw) {
//           return done(null, result);
//         } else {
//           return done(null, false, { message: "비밀번호가 일치하지 않습니다." });
//         }
//       });
//     }
//   )
// );



app.post('/add', function(req, res){
  db.collection('config').findOne({name : 'totalcount'}, function(err, result){
    var mycount = result.count;
    db.collection('text').insertOne( { _id : (mycount + 1), sub : req.body.sub, text : req.body.text } , function(){
      db.collection('config').updateOne({name:'totalcount'},{ $inc: {count:1} },function(err, result){
        if (err) return console.log(err)
        console.log('save complete')
        res.send('게시물 등록완료');
      });  
    });
  });
 
});
