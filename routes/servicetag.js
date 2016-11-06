var express = require('express'),
    router = express.Router(),
    SN = require('../models/sn.js'),
    moment = require('moment');

router.post('/', function(req, res, next){
    if(req.body.sn){
        SN.findById(req.body.sn).exec(function(err,docs){
            if(err || docs===null){
                // console.log('failed')
                res.json({error:'sn not found'})
                return;
            }else{
                // console.log('success')
                var data = docs.AssetEntitlementData.map(function(item){
                return {_id:{ Service: item.ServiceLevelDescription,
                              StartDate: moment(item.StartDate).format("YYYY-MM-DD"),
                              EndDate: moment(item.StartDate).format("YYYY-MM-DD")
                            }
                        }
                })
                res.json(data);
            }
        })
    }else{
        res.json({error:'miss sn parameter'})
    }
})

module.exports = router;