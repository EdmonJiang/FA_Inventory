var express = require('express'),
    router = express.Router(),
    Pcinfo = require('../models/pcinfo.js'),
    glob = require('glob'),
    csv = require("fast-csv"),
    fs = require('fs'),
    moment = require('moment');
/* GET reports page. */

router.get('/', function(req, res, next){
  var reports = glob.sync('./public/reports/*',{nodir:true}).map(
    function(item){
      var filesize = fs.statSync(item).size;

      if(filesize/1024 <1024)
      {
        filesize = (filesize/1024).toFixed(2) + "KB";
      }else
      {
        filesize = (filesize/1024/1024).toFixed(2) + "MB";
      }

      return {filename:item.split('/').slice(-1),
              created:fs.statSync(item).ctime,
              size: filesize};
      }
    );

  Pcinfo.find().distinct('company',function(err, docs){
      // if(err){
      //   return next(new Error('Can not find company categaries!'));
      // }
      res.render('reports', {
      reports: reports,
      companies: docs,
      items: Object.keys(Pcinfo.schema.paths)
    });
  })

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
    //return next(new Error('Sorry, the file does not exist!'));
    //res.end("Sorry, file does not exist!");
    res.redirect('/reports/');
  }
  
})

router.post('/generate', function(req, res, next){
  console.log(req.body)
  
  var objFields = {};
  var objFilter = {};
  
  if(req.body.hasOwnProperty('filter') && req.body.filter !== 'all'){
    objFilter.company = req.body.filter;
  }
  delete req.body.filter;

  if(Object.keys(req.body).length ===0){

    //  console.log(req.body)
    //res.end('empty');
    res.redirect('/reports/');
    return;
  }
  

  var isValid = Object.keys(req.body).every(function(item){
      return (Object.keys(Pcinfo.schema.paths).indexOf(item) > -1) && (typeof req.body[item] === "string");
    })

  if(!isValid){
    // console.log('args for generate report are error!');
    //res.end('failed');
    res.redirect('/reports/');
    return;
  }

  Object.keys(req.body).map(function(item){
    objFields[item] = 1;
  })
  
  if(objFields.hasOwnProperty('_id') === false){
    objFields._id = 0;
  }
  // console.log(objFilter);
  // console.log(objFields);

  Pcinfo.find(objFilter).select(objFields).exec(function(err, docs){
      if(err){
          // res.end('failed');
          res.redirect('/reports/');
          return;
      };
      if(docs){
        var csvStream = csv.format({headers: true});
        var timestamp = moment(new Date()).format('YYYY-MM-DD-HHmmssSS')+".csv";
        var filepath = './public/temp/'+timestamp;

        var ws = fs.createWriteStream(filepath);
        ws.write("\ufeff");
        ws.on("finish", function(){
          fs.renameSync(filepath, './public/reports/'+timestamp);
          res.redirect('/reports/');
        });
        csv.write(JSON.parse(JSON.stringify(docs)), {headers: true}).pipe(ws);
      }else{
        res.redirect('/reports/');
        // res.end('failed');
        return;
      }
    }
  )
})

router.get('/generate', function(req, res, next){
  redirect('/reports/');
})

router.get('/delete/:filename', function(req, res, next){
  var filename = './public/reports/'+req.params.filename;
  var reports = glob.sync('./public/reports/*',{nodir:true});

  if(reports.indexOf(filename) !== -1){
    fs.unlinkSync(filename);
    res.redirect('/reports/');
  }else{
    res.redirect('/reports/');
    //res.end("Sorry, file does not exist!");
  }
})

module.exports = router;