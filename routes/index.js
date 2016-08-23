var express = require('express');
var router = express.Router();
var Pcinfo = require('../models/pcinfo.js');
var glob = require('glob');
var userinfo = {};
var fs=require('fs');
var mongoXlsx = require('mongo-xlsx');
/* GET home page. */
router.get('/', function(req, res, next) {

  Pcinfo.find({}).exec(function(err, pcinfos){
    if (err){return next(new Error('could not find data!'))};
    var url = req.url;
    res.render('index', {pcinfos: pcinfos, currentUrl: url});
  })
  
});

router.post('/', function(req, res, next){

  console.log(req.body);
  userinfo = req.body;
  res.end();
  
  if(userinfo.ComputerName){
    Pcinfo.findOne({ComputerName:userinfo.ComputerName}, function(err, doc){
      if(doc){
        for(var i in userinfo){
          if(userinfo.hasOwnProperty(i)){
            doc[i] = userinfo[i];
          }
        }
        doc.updated = new Date;
        doc.save(function(err){
          if (err){return next(new Error('save failed!'))};
          console.log('save successful');
        });

      }else{
        var pcinfo = new Pcinfo(userinfo);
        pcinfo.save(function(err){
          if (err){return next(new Error('save failed!'))};
        })
      }
    })
  }

  
});

router.get('/details/:cn', function(req, res, next){
  var computer = {};
  
  if(req.params.cn){

    computer.ComputerName = req.params.cn;
    Pcinfo.findOne(computer, function(err, details){

      if (err || !details){
        //return next(new Error('could not find the pc for delete!'));
        res.render('error', {message: 'the computer does not exist.',error:{status:404}})
      }else{
        var objpc = {};
        for(var prop in details._doc){
          if(details._doc.hasOwnProperty(prop)){
            objpc[prop]=details._doc[prop];
          }
        }
        delete objpc.__v;
        delete objpc._id;
        res.render('details', {computer: objpc});
      };
      
    })
  }
})

router.post('/details/:cn', function(req, res, next){
  var objpc = {};
  objpc.ComputerName = req.params.cn;
  if(req.body){
    Pcinfo.update(objpc, req.body, {upsert:false}, function(err){
      if(err){
        //console.log('update failed');
        res.end('failed');
      }
        //console.log('update successful');
        res.end('successful');
    })
  }
})

router.get('/delete/:cn', function(req, res, next){
  var computer = {};
  
  if(req.params.cn){

    computer.ComputerName = req.params.cn;
    Pcinfo.findOneAndRemove(computer).exec(function(err){
      if (err){return next(new Error('could not find the pc!'))};
      computer.status = 'This computer has been deleted!'
      res.render('details', {computer: computer});
      //res.redirect('/');
    })
  }
})

router.get('/reports/', function(req, res, next){
  var reports = glob.sync('./public/reports/*',{nodir:true}).map(function(item){return item.split('/').slice(-1)});
  var url = req.url;

  res.render('reports', {currentUrl: url, reports: reports});
})

router.get('/reports/:filename', function(req, res, next){
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

router.get('/reports/generate/', function(req, res, next){
 
})

module.exports = router;
