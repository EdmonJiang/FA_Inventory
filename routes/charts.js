var express = require('express'),
    router = express.Router(),
    Pcinfo = require('../models/pcinfo.js');
/* GET statistics page. */

router.get('/', function(req, res, next){

  Pcinfo.find().distinct('company',function(err, docs){
      res.render('charts', {
          companies: docs,
      });
  })
})

module.exports = router;