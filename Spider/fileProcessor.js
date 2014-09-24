/**
 * Created by Vodalok on 2014/9/17.
 */
var async = require('async');
var fs = require('fs');
var http = require('http');

exports.enqueue = function(url,filename)
{
    var queue = async.queue(function(task,cb){
        var file = fs.createWriteStream(__dirname+'/../crawled/'+task.filename);
        var req = http.get(task.url,function(resp){
            //console.log('Status Code:'+resp.statusCode);
            resp.pipe(file);
            resp.on('end',function(){
                console.log('File:'+task.filename+' Done'.green);
            }).on('error',function(e){
                console.error(e);
            });
        });

        cb();
    },1);

    queue.push({
        url:url,
        filename:filename
    });

    queue.drain = function()
    {

    }
};

exports.numberOfFiles = function(dirpath,cb)
{
    fs.readdir(dirpath,function(err,files){
        var ret  = files.length;
        cb(err,ret);
    });
};