var express = require('express'),
    router = express.Router(),
    Pcinfo = require('../models/pcinfo.js');
/* GET statistics page. */
var auth = require('./auth');
router.all('/', auth.requireLogin);

router.get('/', function(req, res, next){

  Pcinfo.find().distinct('company',function(err, companies){
    if(err) return next(err);
    Pcinfo.find().distinct('department',function(err, departments){
     if(err) return next(err);
      Pcinfo.find().distinct('Vendor',function(err, vendors){
        if(err) return next(err);
        Pcinfo.find().distinct('OS',function(err, oss){
          if(err) return next(err);
          Pcinfo.find().distinct('CPU',function(err, cpus){
            if(err) return next(err);
            Pcinfo.find().distinct('RAM',function(err, rams){
              if(err) return next(err);
                res.render('statistics', {
                  companies: companies,
                  departments: departments,
                  vendors: vendors,
                  oss: oss,
                  cpus: cpus,
                  rams: rams,
                  groups: Object.keys(Pcinfo.schema.paths),
                  title: "Statistics"
                });
            })
          })
        })
      })
    })
  })

})


router.post('/', function(req, res, next){
  //console.log(req.body);
  var objgroupid = {};
  var objgroup = {};
  var objfilter = {};

  if(Array.isArray(req.body.group)){
    req.body.group.forEach(function(value){
      if(value===''){
        return false;
      }else{
        objgroupid[value] = "$"+value;
      }
    })
  }else{
      //res.redirect('/statistics/');
      res.end('group args must be array');
      return;
  }

  objgroup._id = objgroupid;
  objgroup.total = {$sum:1};
  //delete req.body.count;
    // delete req.body.limit;

  delete req.body.group;

  var isValid = Object.keys(req.body).every(function(item){
    return (Object.keys(Pcinfo.schema.paths).indexOf(item) > -1) && (typeof req.body[item] === "string");
  })
// console.log('isValid: '+isValid);
  if(!isValid){
    // console.log('args for generate report are error!');
    //res.redirect('/reports/');
    res.end('group query args invalid');
    return;
  }

  Object.keys(req.body).forEach(function(value){
    if(req.body[value]===''){
      return false;
    }else{
      objfilter[value] = req.body[value];
    }
  })

  Pcinfo.aggregate([{$match: objfilter},{$group:objgroup}])
    .exec(function(err, docs){
      if(err) {
        res.end('query error!')
        return;
      }
      // console.log(docs)
      res.json(docs);
    })
})


module.exports = router;