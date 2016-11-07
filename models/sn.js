var mongoose = require('mongoose');

var AssetEntitySchema = mongoose.Schema(
    { StartDate: Date,
	  EndDate: Date,
	  ServiceLevelDescription: String,
	  ServiceLevelCode: String,
	},{ _id : false });

var SNSchema = mongoose.Schema({
        _id: {type: String},
        AssetHeaderData:{
                BUID: String,
                ServiceTag: String,
                ShipDate: Date,
                CountryLookupCode: String,
                LocalChannel: String,
                CustomerNumber: String,
                ItemClassCode: String,
                IsDuplicate: Boolean,
                MachineDescription: String,
                OrderNumber: String,
                ParentServiceTag: String
            },
        ProductHeaderData:{
                SystemDescription: String,
                ProductId: String,
                ProductFamily: String,
                LOB: String,
                LOBFriendlyName: String
            },
        AssetEntitlementData:[ AssetEntitySchema ]
    },{versionKey: false, collection: 'servicetag'});
    
module.exports = mongoose.model('SN', SNSchema);


