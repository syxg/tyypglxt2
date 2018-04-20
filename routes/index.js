var express = require('express');
var connection = require('./db');
var crypto = require("crypto");
var router = express.Router();
connection.connect();
/* GET home page. */
router.get('/', function (req, res, next) {

  connection.query('insert into we(w) value(?)', [5], function (err, result) {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message);
      return;
    }

  });

  res.render('index', { title: 'Express' });
});

function User(user) {
  this.id = user.id;//数据库中 _id
  this.name = user.name;//用户名
  this.password = user.password;//用户密码
  this.veri = user.veri;//验证码
}
router.get('/AdminLoginAndRegHandler', function (req, res, next) {
  //	req.query
  switch (req.query.action) {
    case "verification":
      //获取验证码
      var str = "qwertyuiopasdfghjklzxcvbnm1234567890";
      var randomNum = function (min, max) {
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
    case "checkid":
      var id=req.query.id
      connection.query('select count(*) as v from user where id=?', [id], function (err, result) {
        if (err) {
          console.log('[INSERT ERROR] - ', err.message);
          return;
        }
        if (result[0].v == 0) {
          res.send({
            success: "id可用"
          });
        } else {
          res.send({
            err: "id不可用"
          });
        }
      });
      break;
    default:
      break;
  }

});

router.post('/AdminLoginAndRegHandler', function (req, res, next) {
  switch (req.query.action) {
    case "register":
      var userInfos = {};
      userInfos.id = req.body.id;
      userInfos.name = req.body.name;
      userInfos.sex = req.body.sex;
      userInfos.phone = /^1\d{10}$/.test(parseInt(req.body.phone)) ? req.body.phone : null;
      userInfos.email = req.body.email;
      var md5 = crypto.createHash("md5");
      userInfos.password = md5.update(req.body.password).digest("base64");
      connection.query('insert into user(id,name,sex,phone,email,password) value(?,?,?,?,?,?)', [userInfos.id, userInfos.name, userInfos.sex, userInfos.phone, userInfos.email, userInfos.password], function (err, result) {
        if (err) {
          console.log('[INSERT ERROR] - ', err.message);
          res.send({ err: "注册失败:" + err.message });
          return;
        }
        if (result.affectedRows == 1) {
          res.send({ success: "注册成功" });
        } else {
          res.send({ err: "注册失败" });
        }
      });
      break;
    case "login":
      var md5 = crypto.createHash("md5");
      var password = md5.update(req.body.password).digest("base64");
      connection.query('select count(*) as v from user where id=? and password=?', [req.body.id,password], function (err, result) {
        if (err) {
          console.log('[INSERT ERROR] - ', err.message);
          res.send({ err: "登录失败:" + err.message });
          return;
        }
        if (result[0].v == 1) {
          res.send({ success: "登录成功" });
        } else {
          res.send({ err: "登录失败" });
        }
      });
      break;




  }
});
module.exports = router;
