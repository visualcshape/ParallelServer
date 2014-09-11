/**
 * Created by Vodalok on 2014/9/5.
 */
var crc = require('crc');

var exp = module.exports;

exp.dispatchConnector = function(uid,connector)
{
    console.log(crc.crc32(uid));
    console.log(parseInt(crc.crc32(uid), 16));
    var index = Math.abs(parseInt(crc.crc32(uid),16))%connector.length;
    return connector[index];
};