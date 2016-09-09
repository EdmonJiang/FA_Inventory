var express = require('express');
var router = express.Router();
var Pcinfo = require('../models/pcinfo.js');
var fs = require('fs');
var moment = require('moment');
var Pclog = require('../models/pclog.js');
/* GET statistics page. */

router.get('/', function(req, res, next){

  Pclog.find({})
    .where('created').gt(moment(Date.now()).format('YYYY-MM-DD'))
    .exec(function(err, docs){
      res.render('logs',{logs: docs});
    });
    
})

router.post('/', function(req, res, next){

  Pclog.find({})
    .where('created').gt(moment(Date.now()).format('YYYY-MM-DD'))
    .exec(function(err, docs){
      if(err){res.send('error');
              return;}
      res.send(docs);
    });
    
})

module.exports = router;