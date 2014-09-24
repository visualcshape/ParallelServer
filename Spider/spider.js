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
                var today = new Date();
                today = today.toLocaleTimeString();
                if (filename.match(/\D-\D\d{4}-\d{3}\.xml/)) {
                    console.log('['+today+']'+link.green);
                    if (filenameList.indexOf(filename) > -1) {
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
        for(var i = 0 ; i < downloadQueue.length ; i++) {
            fp.enqueue(downloadQueue[i].link, downloadQueue[i].filename);
        }
    }
});

c.queue("http://opendata.cwb.gov.tw/forecast/dataset/");