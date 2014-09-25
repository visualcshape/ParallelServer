/**
 * Created by Vodalok on 2014/9/16.
 */
var crawler = require('crawler').Crawler;
var http = require('http');
var fs = require('fs');
var colors = require('colors');
var fp = require('./fileProcessor');
var async = require('async');

var DIR_PATH = __dirname + '/crawled/';

var filenameList = [];
var crawledPage = [];
var downloadQueue = [];
var ignore_folder = ['MMC'];

var c = new crawler({
    "maxConnections": 10,
    //Called for each crawled page
    "callback": function (error, result, $) {
        try {
            $('a').each(function (index, a) {
                var link = a.href;
                var split = link.split('/');
                split = split.map(function (delim) {
                    return delim;
                });
                var filename = split[split.length - 1];
                var folder = split[split.length-2];
                var today = new Date();
                today = today.toLocaleTimeString();
                if (filename.match(/\D-\D\d{4}-\d{3}\.xml/)) {
                    console.log('[%s]'+link.green,today.toString());
                    if (filenameList.indexOf(filename) > -1 || ignore_folder.indexOf(folder) > -1) {
                        console.log('[%s]'+'Skip'.blue,today.toString());
                    } else {
                        filenameList.push(filename);
                        downloadQueue.push({link:link,filename:filename});
                    }
                } else {

                    if (crawledPage.indexOf(link) > -1) {
                        console.log('[%s]'+link.blue,today.toString());
                    } else {
                        console.log('[%s]'+link.red,today.toString());

                        c.queue(link);
                    }
                }
                crawledPage.push(link);
            });
        } catch (err) {
            console.log('End of Node'.cyan);
        }
    },
    "onDrain": function () {
        console.log("Crawl completed.".green);
        //deal with files...
        console.log("Start downloading...");

        var queue = async.queue(function(task,cb){
            var file = fs.createWriteStream(__dirname+'/../crawled/'+task.filename);
            var req = http.get(task.url,function(resp){
                console.log('Getting file from:'+task.url);
                console.log('Status Code : '+ resp.statusCode.toString().blue);
                console.log('Writing File: '.green+task.filename);
                resp.pipe(file);
                resp.on('end',function(){
                    console.log('File:'+task.filename+' Done'.green);
                    cb();
                }).on('error',function(e){
                    console.error(e);
                });
            });
        },1);
        for(var i=0; i<downloadQueue.length;i++){
            queue.push({
                url:downloadQueue[i].link,
                filename:downloadQueue[i].filename
            });
        }
        queue.drain = function(){

        }
    }
});

c.queue("http://opendata.cwb.gov.tw/forecast/dataset/");