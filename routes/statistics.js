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

  Pcinfo.aggregate([{$match:{RAM:"32 GB"}},{$group:{_id:{department:"$department",user:"$displayName"}}}])
    .exec(function(err, docs){

      res.send(JSON.stringify(docs));
    })
})


module.exports = router;