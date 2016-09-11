var express = require('express');
var router = express.Router();
var Pcinfo = require('../models/pcinfo.js');
var fs = require('fs');
var moment = require('moment');
var Pclog = require('../models/pclog.js');
/* GET statistics page. */

router.get('/', function(req, res, next){

  var weekago = new Date(Date.now() - 7*24*60*60*1000);
  var weekagoDay = new Date(weekago.getFullYear()+"-"+weekago.getMonth()+"-"+weekago.getDay());

  Pclog.aggregate([{$match:{created:{$gt:weekagoDay}}},{$group:{_id:{month:{$month:"$created"},day:{$dayOfMonth:"$created"}, action:"$action"},total:{$sum:1}}}])
       .exec(function(err, docs){
         if(err){console.log(err)}
         res.render('logs', {docs: JSON.stringify(docs)});
       })
   
})

router.post('/', function(req, res, next){

    // .where('created').gt(moment(Date.now()).format('YYYY-MM-DD'))
  Pclog.find({})
    .exec(function(err, docs){
      if(err){res.send('error');
              return;}
      var data = docs.map(function(item){
        return {_id:{ DateTime: moment(item.created).format("YYYY-MM-DD HH:mm:ss"),
                      ComputerName: item.ComputerName,
                      LogonName: item.LogonName,
                      displayName: item.displayName,
                      action: item.action}}
      })
      res.json(data);
    });
    
})

module.exports = router;