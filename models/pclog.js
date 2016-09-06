var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PclogSchema = Schema({
    ComputerName: {type: String, required: true},
    LogonName: {type: String, default: ''},
    displayName: {type: String, default: ''},
    pcinfo: {type: Schema.Types.ObjectId, ref: 'Pcinfo'},
    recycle: {type: Schema.Types.ObjectId, ref: 'Recycle'},
    method: {type: String, required: true},
    created: {
        type: Date,
        default: new Date
    }
    },{collection: 'pclog'});

module.exports = mongoose.model('Pclog', PclogSchema);