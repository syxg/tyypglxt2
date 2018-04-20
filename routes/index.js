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
router.post('/AdminLoginAndRegHandler',function(req, res, next){
  switch(req.query.action){
    case "register":
      var userInfos = {};
      userInfos.id=req.body.id;
      userInfos.name=req.body.name;
      userInfos.sex=req.body.sex;
      userInfos.phone= /^1\d{10}$/.test(parseInt(req.body.phone)) ? req.body.phone : null;
      userInfos.email=req.body.email;
      var md5 = crypto.createHash("md5");
      userInfos.password = md5.update(req.body.password).digest("base64");
      connection.query('insert into user(id,name,sex,phone,email,password) value(?,?,?,?,?,?)',[userInfos.id,userInfos.name,userInfos.sex,userInfos.phone,userInfos.email,userInfos.password],function (err, result) {
        if(err){
          console.log('[INSERT ERROR] - ',err.message);
          res.send({ err: "注册失败:"+ err.message});
          return;
        }
        if (result.affectedRows == 1) {
          res.send({ success: "注册成功" });
        } else {
          res.send({ err: "注册失败" });
        }
      });

  }
});
module.exports = router;
