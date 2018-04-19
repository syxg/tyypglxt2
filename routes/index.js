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

module.exports = router;
