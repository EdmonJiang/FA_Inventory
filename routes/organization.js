var express = require('express');
var router = express.Router();
var Pcinfo = require('../models/pcinfo.js');
var fs = require('fs');
var moment = require('moment');
var Pclog = require('../models/pclog.js');
/* GET statistics page. */

router.get('/', function(req, res, next){

  Pcinfo.find().distinct('company',function(err, docs){
      res.render('organization', {
          companies: docs,
      });
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