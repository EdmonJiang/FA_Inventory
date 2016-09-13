var express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    Pclog = require('../models/pclog.js');
/* GET statistics page. */

router.get('/', function(req, res, next){

  var weekago = new Date(Date.now() - 7*24*60*60*1000);
  var weekagoDay = new Date(weekago.getFullYear()+"-"+(weekago.getMonth()+1)+"-"+weekago.getDate());

  Pclog.aggregate([{$match:{created:{$gt:weekagoDay}}},{$group:{_id:{month:{$month:"$created"},day:{$dayOfMonth:"$created"}, action:"$action"},total:{$sum:1}}}])
       .exec(function(err, docs){
         if(err){console.log(err)}
         res.render('logs', {docs: JSON.stringify(docs)});
       })
   
})

router.post('/', function(req, res, next){
  var today = new Date();
  today.setHours(0,0,0,0);
    // .where('created').gt(moment(Date.now()).format('YYYY-MM-DD'))
  Pclog.find({})
    .where('created').gt(today)
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