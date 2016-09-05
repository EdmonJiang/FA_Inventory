var express = require('express');
var router = express.Router();
var Pcinfo = require('../models/pcinfo.js');
var glob = require('glob');
var csv = require("fast-csv");
var fs = require('fs');
var moment = require('moment');
/* GET statistics page. */

router.get('/', function(req, res, next){

  Pcinfo.find().distinct('company',function(err, companies){
    Pcinfo.find().distinct('department',function(err, departments){
      Pcinfo.find().distinct('Vendor',function(err, vendors){
        Pcinfo.find().distinct('OS',function(err, oss){
          Pcinfo.find().distinct('CPU',function(err, cpus){
            Pcinfo.find().distinct('RAM',function(err, rams){
      res.render('statistics', {
        companies: companies,
        departments: departments,
        vendors: vendors,
        oss: oss,
        cpus: cpus,
        rams: rams,
        groups: Object.keys(Pcinfo.schema.paths)
    });
  })
   })
    })
     })
      })
       })

})


router.post('/', function(req, res, next){
  console.log(req.body);
  var objgroupid = {};
  var objgroup = {};
  var objfilter = {};
  var limit = 1000;
  
  if(Array.isArray(req.body.group)){
    req.body.group.forEach(function(value){
      if(value===''){
        return false;
      }else{
        objgroupid[value] = "$"+value;
      }
    })
  }else{
      return;
  }

  if(req.body.hasOwnProperty('count')){
    objgroup._id = objgroupid;
    objgroup.total = {$sum:1};
    delete req.body.count;
  }else{
    objgroup._id = objgroupid;
  }

  if(req.body.limit === ''){
    delete req.body.limit;
  }else{
    limit = parseInt(req.body.limit);
    delete req.body.limit;
  }
  delete req.body.group;
  
  Object.keys(req.body).forEach(function(value){
    if(req.body[value]===''){
      return false;
    }else{
      objfilter[value] = req.body[value];
    }
  })

  Pcinfo.aggregate([{$match: objfilter},{$group:objgroup},{$limit:limit}])
    .exec(function(err, docs){
      if(err) return next(err)
      //console.log(docs)
      res.send(JSON.stringify(docs));
    })
})


module.exports = router;