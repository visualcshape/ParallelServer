/**
 * Created by Vodalok on 2014/9/24.
 */
var fs = require('fs');
var xml2json = require('xml2js');
var fp = require('../Spider/fileProcessor');
var colors = require('colors');
var async = require('async');
var util = require('util');
var prettyJson = require('prettyjson');

var FROM_PATH = __dirname + '/../crawled/';
var TO_PATH = __dirname + '/../WeatherJson/';

async.waterfall([
    function (callback) {
        fp.numberOfFiles(FROM_PATH, function (err, number) {
            if (err) {
                console.error(err);
            }
            callback(null, number);
        });
    },
    function (number,callback) {
        //get filename
        var fileList;
        fs.readdir(FROM_PATH,function(err,files){
            if(err){
                console.error(err);
            }
            callback(null,number,files);
        });
    },
    function(number,files,callback){
        var fullPath = [];
        for(var i=0; i<number; i++){
            fullPath.push(FROM_PATH+files[i]);
        }
        callback(null,number,files,fullPath);
    },
    function(number,files,fullPath,callback){
        var data;
        for(var i=0; i<number; i++){
            data = fs.readFileSync(fullPath[i]);
            callback(null,data,files[i]);
        }
    },
    function(data,file,callback){
        var xmlParser = new xml2json.Parser();
        xmlParser.parseString(data,function(err,result){
            if(err){
                console.error('At '+file);
                console.error(err);
            }
            callback(null,result,file);
        });
    }], function (err,data,file) {
    var dataToWrite = JSON.stringify(data,null,"    ");

    var split = file.split('.');
    split = split.map(function(delim){
        return delim;
    });
    fs.writeFile(TO_PATH+split[0]+'.json',dataToWrite,function(err){
        if(err){
            console.error(err);
        }else{
            console.log(file.toString().green+' Done.'.green);
        }
    });
});