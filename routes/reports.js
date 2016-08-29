var express = require('express');
var router = express.Router();
var Pcinfo = require('../models/pcinfo.js');
var glob = require('glob');
var userinfo = {};
var fs=require('fs');
/* GET reports page. */

router.get('/', function(req, res, next){
  var reports = glob.sync('./public/reports/*',{nodir:true}).map(function(item){return item.split('/').slice(-1)});
  
  res.render('reports', {currentUrl: '/reports', reports: reports});
})

router.get('/:filename', function(req, res, next){
  var filename = req.params.filename;
  var reports = glob.sync('./public/reports/*',{nodir:true});
  if(filename in reports){
      reports.forEach(function(report,index){
      if(filename === report.split('/').slice(-1)){
        fs.creatReadStream(report).pipe(res);
      }
    })
  }else{
    res.end();
  }
  
})

router.get('/generate', function(req, res, next){
 
})

module.exports = router;