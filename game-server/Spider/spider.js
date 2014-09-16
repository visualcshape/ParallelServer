/**
 * Created by Vodalok on 2014/9/16.
 */
var crawler = require('crawler').Crawler;
var http = require('http');
var fs = require('fs');
var colors = require('colors');
var fp = require('./fileProcessor');
var async = require('async');

var DIR_PATH = __dirname+'/crawled/';

var isContinue = true;

var fileList = [];

var enter = true;

var c = new crawler({
    "maxConnections":10,
    "skipDuplicates":true,
    "cache":true,
    //Called for each crawled page
    "callback":function(error,result,$){
        if(typeof $ ==='undefined')
        {
            console.log('stop');
            process.exit(0);
        }
        $('a').each(function(index,a){
            var link = a.href;
            var split = link.split('/');
            split = split.map(function(delim){
                return delim;
            });
            var filename = split[split.length-1];
            //console.log("href:"+a.href,"index"+index);
            if(filename.match(/\D-\D\d{4}-\d{3}\.xml/))
            {
                console.log(a.href.green , "  "+index);
                if(fileList.indexOf(filename)>-1)
                {
                    console.log('Skip'.blue);
                }
                else
                {
                    fp.enqueue(a.href,filename);
                    fileList.push(filename);
                }
            }else{
                console.log(a.href.red, "  "+index);
            }
            c.queue(a.href);
        })
    },
    "onDrain":function()
    {
        console.log("Crawl completed.");
        //deal with files...
        //null
        while(fp.IS_DRAIN)
        {
            process.exit(0);
        }
    }
});

c.queue("http://opendata.cwb.gov.tw/forecast/dataset/");