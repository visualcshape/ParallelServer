/**
 * Created by Vodalok on 2014/9/17.
 */
var async = require('async');
var fs = require('fs');
var http = require('http');

exports.numberOfFiles = function(dirpath,cb)
{
    fs.readdir(dirpath,function(err,files){
        var ret  = files.length;
        cb(err,ret);
    });
};