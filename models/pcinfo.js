var mongoose = require('mongoose'),
SN = require('./sn.js');

var pcSchema = mongoose.Schema({
    ComputerName: {type: String, required: true},
    LogonName: {type: String, required: true},
    Domain: {type: String, default: ''},
    Vendor: {type: String, default: ''},
    Model: {type: String, default: ''},
    SN: {type: String, default: '', ref: 'SN'},
    OS: {type: String, default: ''},
    CPU: {type: String, default: ''},
    RAM: {type: String, default: ''},
    Video: {type: String, default: ''},
    HDD: {type: String, default: ''},
    IP: {type: String, default: ''},
    displayName: {type: String, default: ''},
    description: {type: String, default: ''},
    title: {type: String, default: ''},
    department: {type: String, default: ''},
    company: {type: String, default: ''},
    phoneNumber: {type: String, default: ''},
    mail: {type: String, default: ''},
    userPrincipalName: {type: String, default: ''},
    distinguishedName: {type: String, default: ''},
    warranty: {type: Date, default: ''},
    remark: {type: String, default: ''},
    FixedAssetNO: {type: String, default: ''},
    Accessories: {type: String, default: ''},
    created: {
        type: Date,
        default: new Date
    },
    updated: {
        type: Date,
        default: new Date
    }
    },{collection: 'pcinfo', toObject: {getters:true}});

if (!pcSchema.options.toObject) pcSchema.options.toObject = {};

pcSchema.options.toObject.transform = function (doc, ret, options) {
  if (options.hide) {
    options.hide.split(' ').forEach(function (prop) {
      delete ret[prop];
    });
  }
  return ret;
}

module.exports = mongoose.model('Pcinfo', pcSchema);