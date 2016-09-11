var express = require('express');
var router = express.Router();
var Pcinfo = require('../models/pcinfo.js');
var Recycle = require('../models/recycle.js');
var Pclog = require('../models/pclog.js');

var objSort = {pc:"ComputerName",pcd:"-ComputerName",
               name:"displayName",named:"-displayName",
               ram:"RAM",ramd:"-RAM"};

/* GET home page. */
router.get('/', function(req, res, next) {
  
  var currentPage = 1;
  var q = {};
  var d = {};
  var sort = req.query.sort?req.query.sort:'pc';
  var qstring = '';
  if(req.query.page){
    currentPage = req.query.page;
  }
  if(['pc','pcd','name','named'].indexOf(sort)===-1){
    sort = 'pc';
  }
 // sort = objSort[sort];
 // console.log(sort);
  if(req.query.q){

    q.ComputerName = new RegExp(req.query.q.trim(), 'i');
    d.displayName = new RegExp(req.query.q.trim(), 'i');
    //q.SN = new RegExp(req.query.q.trim(), 'i');
    qstring = '&q='+req.query.q;
  }
    //qstring = qstring + '&sort=' + sort;
  // console.log(q);
  Pcinfo.find({}).or([q,d]).count(function(err, count){
    Pcinfo.find({}).or([q,d])
      .sort(objSort[sort]).skip((currentPage-1)*10).limit(10)
      .exec(function(err, pcinfos){
      if (err){return next(new Error('could not find data!'))};
      //console.log("count is: "+count);
      res.render('index', {
        pcinfos: pcinfos, 
        currentPage: currentPage,
        count: count,
        keyword: req.query.q,
        sort: sort,
        qstring: qstring,
        totalPage: count===0?1:Math.ceil(count/10)
      });
    })
  })
  
  
});
// receive pcinfo
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
        doc.save(function(err, doc){
          if (err){return next(new Error('save failed!'))};
          saveLog('update', doc);
          console.log('save successful');
        });

      }else{
        var pcinfo = new Pcinfo(userinfo);
        pcinfo.save(function(err, doc){
          if (err){return next(new Error('save failed!'))};

          saveLog('add', doc);
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
        //delete objpc._id;
        res.render('details', {computer: objpc});
      };
      
    })
  }
})
// update pcinfo details
router.post('/details/:cn', function(req, res, next){
  var objpc = {};
  if(req.params.cn){
    objpc.ComputerName = req.params.cn;
  }else{
    res.end('failed');
    return;
  }
  
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
    Pcinfo.findOneAndRemove(computer).exec(function(err,pcinfo){
      if (err){return next(new Error('could not find the pc!'))};

      var recycle = new Recycle(pcinfo.toJSON());
      recycle.save(function(err, doc){
          if (err){return next(new Error('recycle failed!'))};

          saveLog('delete', doc);
      })
      computer.status = 'This computer has been deleted!'
      res.render('details', {computer: computer});
      //res.redirect('/');
    })
  }
})

function saveLog(action, doc){
  var pclog = new Pclog();
    pclog.ComputerName = doc.ComputerName;
    pclog.LogonName = doc.LogonName;
    pclog.displayName = doc.displayName;
    if(action === 'delete'){
      pclog.recycle = doc._id;
    }else{
      pclog.pcinfo = doc._id;     
    }
    pclog.action = action;
    pclog.save(function(err){
    if (err){return next(new Error('pclog save failed!'))};
    console.log('saved: '+doc);
  })
}

module.exports = router;
