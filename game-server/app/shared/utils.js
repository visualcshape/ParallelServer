/**
 * Created by Vodalok on 2014/8/16.
 */
var utils = module.exports;

utils.invokeCallback = function(cb)
{
    if(!!cb&&typeof cb === 'function')
    {
        cb.apply(null,Array.prototype.slice.call(arguments,1));
    }
};