/**
 * Created by Vodalok on 2014/8/13.
 */
var crypto = require('crypto');

exports.generate = function()
{
    var curDate = Date.now();
    var random = Math.random();

    var hashed = crypto.createHash('sha1').update(curDate+random.toString()).digest('base64');

    return hashed;
};
