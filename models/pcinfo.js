var mongoose = require('mongoose');

var pcSchema = mongoose.Schema({
    ComputerName: {type: String, default: ''},
    LogonName: {type: String, default: ''},
    Domain: {type: String, default: ''},
    Vendor: {type: String, default: ''},
    Model: {type: String, default: ''},
    SN: {type: String, default: ''},
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
    },{collection: 'pcinfo'});

module.exports = mongoose.model('Pcinfo', pcSchema);