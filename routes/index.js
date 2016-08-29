var express = require('express');
var router = express.Router();
var Pcinfo = require('../models/pcinfo.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  var currentPage = 1;
  var q = {};
  var d = {};
  var qstring = '';
  if(req.query.page){
    currentPage = req.query.page;
  }

  if(req.query.q){
    q.ComputerName = new RegExp(req.query.q.trim(), 'i');
    d.displayName = new RegExp(req.query.q.trim(), 'i');
    //q.SN = new RegExp(req.query.q.trim(), 'i');
    qstring = '&q='+req.query.q;
  }
  console.log(q);
  Pcinfo.find({}).or([q,d]).count(function(err, count){
    Pcinfo.find({}).or([q,d])
      .sort('ComputerName').skip((currentPage-1)*10).limit(10)
      .exec(function(err, pcinfos){
      if (err){return next(new Error('could not find data!'))};
      console.log("count is: "+count);
      res.render('index', {
        pcinfos: pcinfos, 
        currentUrl: '/index',
        keyword: req.query.q,
        qstring: qstring,
        totalPage: count===0?1:Math.ceil(count/10)
      });
    })
  })
  
  
});

router.post('/', function(req, res, next){
  var userinfo = {};
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
        doc.increment();
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


module.exports = router;
