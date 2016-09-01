var express = require('express');
var router = express.Router();
var Pcinfo = require('../models/pcinfo.js');
var glob = require('glob');
var csv = require("fast-csv");
var fs = require('fs');
var moment = require('moment');
/* GET statistics page. */

router.get('/', function(req, res, next){

      res.render('statistics', {
    });


})

router.get('/download/:filename', function(req, res, next){
  var filename = './public/reports/'+req.params.filename;
  var reports = glob.sync('./public/reports/*',{nodir:true});
  //console.log(reports)
  //console.log(filename)
  if(reports.indexOf(filename) !== -1){
    res.setHeader('Content-disposition', 'attachment; filename='+req.params.filename);
    res.writeHead(200, {
        'Content-Type': 'text/csv'
    });
    fs.createReadStream(filename).pipe(res);
  }else{
    res.end("Sorry, file does not exist!");
  }
  
})

router.post('/generate', function(req, res, next){
  //console.log(req.body)
  
  var objFields = {};
  var objFilter = {};

  if(req.body.hasOwnProperty('filter') && req.body.filter !== 'all'){
    objFilter.company = req.body.filter;
  }
  delete req.body.filter;

  Object.keys(req.body).map(function(item){
    objFields[item] = 1;
  })
  
  if(objFields.hasOwnProperty('_id') === false){
    objFields._id = 0;
  }
  // console.log(objFilter);
  // console.log(objFields);

  Pcinfo.find(objFilter).select(objFields).exec(function(err, docs){
      if(err) return next(new Error('can not export pcinfo!'));

        var csvStream = csv.format({headers: true});
        var timestamp = moment(new Date()).format('YYYY-MM-DD-HHmmssSS')+".csv";
        var filepath = './public/temp/'+timestamp;

        var ws = fs.createWriteStream(filepath);
        ws.on("finish", function(){
          fs.renameSync(filepath, './public/reports/'+timestamp);
          res.redirect('/reports/');
        });
        csv.write(JSON.parse(JSON.stringify(docs)), {headers: true}).pipe(ws);
    }
  )
})

router.get('/generate', function(req, res, next){
  redirect('/reports');
})

router.get('/delete/:filename', function(req, res, next){
  var filename = './public/reports/'+req.params.filename;
  var reports = glob.sync('./public/reports/*',{nodir:true});

  if(reports.indexOf(filename) !== -1){
    fs.unlinkSync(filename);
    res.redirect('/reports/');
  }else{
    res.end("Sorry, file does not exist!");
  }
})

module.exports = router;