var express = require('express'),
    router = express.Router(),
    SN = require('../models/sn.js'),
    moment = require('moment');

router.post('/', function(req, res, next){
    if(req.body.sn){
        SN.findById(req.body.sn).exec(function(err,docs){
            if(err || docs===null){
                // console.log('failed')
                res.json({error:'The SN was not found'})
                return;
            }else{
                // console.log('success')
                if(docs.AssetEntitlementData && docs.AssetEntitlementData.length>0){
                    var data = docs.AssetEntitlementData.map(function(item){
                    return {_id:{ Service: item.ServiceLevelDescription,
                                StartDate: moment(item.StartDate).format("YYYY-MM-DD"),
                                EndDate: moment(item.EndDate).format("YYYY-MM-DD")
                                }
                            }
                    })
                    res.json(data);
                }
                else{
                    res.json({error:'No warranty infomation found'});
                    SN.remove({_id: req.body.sn}, function (err){
                        if(err){
                            console.log("failed to remove empty warranty record.")
                        }
                    });
                }
            }
        })
    }else{
        res.json({error:'missed sn parameter'})
    }
})

module.exports = router;