var express = require('express');
var router = express.Router();
var Pcinfo = require('../models/pcinfo.js');

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
    qstring = '&q='+req.query.q;
  }

  Pcinfo.find({}).or([q,d]).count(function(err, count){
    Pcinfo.find({}).or([q,d])
      .sort(objSort[sort]).skip((currentPage-1)*10).limit(10)
      .exec(function(err, pcinfos){
      if (err){return next(new Error('No Data Found!'))};
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

router.post('/', function(req, res, next){
  var userinfo = {};
  userinfo = req.body;
  res.end();
  // console.log(req.body)
  if(userinfo.ComputerName && userinfo.LogonName){
    Pcinfo.findOne({ComputerName:userinfo.ComputerName}, function(err, doc){
      if(doc){
        // console.log('pc found');
        for(var i in userinfo){
          if(userinfo.hasOwnProperty(i)){
            doc[i] = userinfo[i];
          }
        }
        doc.updated = new Date;
        doc.increment();
        doc.save(function(err){
          if (err){console.log('update failed')};
          // console.log('update successful');
        });

      }else{
        // console.log('pc not found');
        var pcinfo = new Pcinfo(userinfo);
        pcinfo.save(function(err){
          if (err){console.log('add failed')};
          // console.log('add successful');
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
        
        res.render('404', {error:{status:404,message: 'The computer does not exist.'}})
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

router.post('/details/:cn', function(req, res, next){
  var objpc = {};
// console.log(req.body)
  if(req.params.cn){
    objpc.ComputerName = req.params.cn;
  }else{
    res.end('failed');
    return;
  }

  if(req.body)
  {
    var isValid = Object.keys(req.body).every(function(item){
      return (["FixedAssetNO", "Accessories", "warranty", "remark"].indexOf(item) > -1) && (typeof req.body[item] === "string");
    })

    // console.log("isValid: "+isValid)
    if(isValid)
      {

          Pcinfo.findOneAndUpdate(objpc, req.body, {upsert:false}, function(err, doc){
              if(err){
                // console.log(err+'update failed');
                res.end('failed');
                return;}
                
              // console.log('update successful');
              res.end('successful');
            })

        }else{
          // console.log('args error!');
          res.end('failed');
        }

  }else{
    res.end('failed');
  }

})

router.get('/delete/:cn', function(req, res, next){
  
  if(req.params.cn){
    var computer = {};
    computer.ComputerName = req.params.cn;

    Pcinfo.findOneAndRemove(computer).exec(function(err, doc){
      if (err || !doc){
        computer.status = 'This computer does not exsit!';
        res.render('details', {computer: computer});
        return;
      };
      //console.log(doc)
      computer.status = 'This computer has been deleted!';
      res.render('details', {computer: computer});
      //res.redirect('/');
    })
  }
})


module.exports = router;
