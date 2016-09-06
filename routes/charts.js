var express = require('express');
var router = express.Router();
var Pcinfo = require('../models/pcinfo.js');
var fs = require('fs');
var moment = require('moment');
/* GET statistics page. */

router.get('/', function(req, res, next){

  Pcinfo.find().distinct('company',function(err, docs){
      res.render('charts', {
          companies: docs,
      });
  })
})

module.exports = router;