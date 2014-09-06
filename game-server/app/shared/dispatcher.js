/**
 * Created by Vodalok on 2014/9/5.
 */
var crc = require('crc');

var exp = module.exports;

exp.dispatchConnector = function(uid,connector)
{
    //var c = parseInt(crc.crc32(uid));
    var index = Math.abs(parseInt(crc.crc32(uid)))%connector.length;
    return connector[index];
};