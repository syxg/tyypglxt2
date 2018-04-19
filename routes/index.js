var express = require('express');
var connection = require('./db');
var crypto=require("crypto");
var router = express.Router();
connection.connect();
/* GET home page. */
router.get('/', function(req, res, next) {
  
  connection.query('insert into we(w) value(?)',[5],function (err, result) {
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return;
    }
    
  });
  
  res.render('index', { title: 'Express' });
});

function User(user){
	this.id=user.id;//数据库中 _id
	this.name=user.name;//用户名
	this.password=user.password;//用户密码
	this.veri=user.veri;//验证码
}
router.get('/AdminLoginAndRegHandler', function(req, res, next) {
  //	req.query
    switch (req.query.action) {
      case "verification":
        //获取验证码
        var str = "qwertyuiopasdfghjklzxcvbnm1234567890";
        var randomNum = function(min, max) {
          return Math.floor(Math.random() * (max - min) + min);
        }
        var veri = "";
        for (var i = 0; i < 4; i++) {
          veri += str[randomNum(0, str.length)];
        }
        req.session.user = new User({
          name: "",
          password: "",
          id: "",
          veri: veri
        })
        res.send({
          success: "成功",
          data: veri
        });
  
        break;
      case "checkVerification":
        //校验验证码
        var veri = req.query.veri;
        var sessionVeri = req.session.user.veri;
        if (veri == sessionVeri) {
          res.send({
            success: "验证码正确"
          });
        } else {
          res.send({
            err: "验证码错误"
          });
        }
  
        break;
      default:
        break;
    }
  
  });

module.exports = router;
