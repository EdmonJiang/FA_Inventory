var express = require('express'),
    router = express.Router(),
    Pcinfo = require('../models/pcinfo.js');
/* GET statistics page. */

router.get('/', function(req, res, next){

  var query_company = Pcinfo.find().distinct('company'),
      query_department = Pcinfo.find().distinct('department'),
      query_vendor = Pcinfo.find().distinct('Vendor'),
      query_os = Pcinfo.find().distinct('OS'),
      query_cpu = Pcinfo.find().distinct('CPU'),
      query_ram = Pcinfo.find().distinct('RAM');

  Promise.all([query_company, query_department, query_vendor, query_os, query_cpu, query_ram])
    .spread(function(company, department, vendor, os, cpu, ram){
      res.render('statistics', {
                  companies: company,
                  departments: department,
                  vendors: vendor,
                  oss: os,
                  cpus: cpu,
                  rams: ram,
                  groups: Object.keys(Pcinfo.schema.paths),
                  title: "Statistics"
    })

  }, function(err){
      return next(err)

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