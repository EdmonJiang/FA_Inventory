var express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    Pclog = require('../models/pclog.js');
/* GET statistics page. */

router.get('/', function(req, res, next){

  var weekago = new Date(Date.now() - 6*24*60*60*1000);
  //var weekagoDay = new Date(weekago.getFullYear()+"-"+(weekago.getMonth()+1)+"-"+weekago.getDate());
  weekago.setHours(0,0,0,0);

  Pclog.aggregate([{$match:{created:{$gte:weekago}}},{$group:{_id:{month:{$month:"$created"},day:{$dayOfMonth:"$created"}, action:"$action"},total:{$sum:1}}}])
       .exec(function(err, docs){
         if(err){console.log(err)}
         res.render('logs', {docs: JSON.stringify(docs)});
       })
   
})

router.post('/', function(req, res, next){
  var today = new Date();
  today.setHours(8,0,0,0);
//console.log(today);
  Pclog.find({created:{$gt: today}})
    .exec(function(err, docs){
      if(err){res.send('error');
              return;}
//console.log(docs);
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