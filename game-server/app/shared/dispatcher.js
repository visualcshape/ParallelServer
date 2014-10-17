/**
 * Created by Vodalok on 2014/9/5.
 */
var crc = require('crc');
var userDAO = require('../DAO/userDAO');
var buildingDAO  =require('../DAO/buildingDAO');
var mapDAO = require('../DAO/mapDAO');
var fs = require('fs');
var PATH = __dirname+'/../../tmxAndInfo/';
var async = require('async');

var exp = module.exports;

exp.dispatchConnector = function(uid,connector)
{
    console.log(crc.crc32(uid));
    console.log(parseInt(crc.crc32(uid), 16));
    var index = Math.abs(parseInt(crc.crc32(uid),16))%connector.length;
    return connector[index];
};

exp.dispatchMapCoord = function(uid,cb)
{
    var big = 0;
    var mid = 0;
    var smallX = 0;
    var smallY = 0;
    var mapKey = '';
    var flag = true;


    async.waterfall([function(cb){
        var genMapKey = function() {
            big = Math.floor(Math.random() * (1 - 0) + 0);
            mid = Math.floor(Math.random() * (4 - 0) + 0);
            smallX = Math.floor(Math.random() * (24 - 0) + 0);
            smallY = Math.floor(Math.random() * (14 - 0) + 0);

            mapKey = big + '.' + mid + '.' + smallX + '-' + smallY;
            console.log('gen mapKey = %s', mapKey);
            mapDAO.isMapInhibit(mapKey, function (isInhibit, inhibitUID) {
                console.log('Is inhibit: %s', isInhibit);
                if (isInhibit == false) {
                    flag = true;
                    cb();
                }
                else {
                    flag = false;
                    console.log('Map %s has been inhibit by %s', mapKey, inhibitUID);
                    genMapKey();
                }
            });
        };
        genMapKey();
    },function(cb){
        console.log('Dispatched map id %s',mapKey);
        mapDAO.insertInhibitMap(mapKey,uid,function(err){
            if(err)
            {
                throw err;
            }
            cb(null,mapKey);
        });
    },function(mapKey,cb)
    {
        console.log('Gen info file');
        genInfoFile(uid,mapKey,function(mapKey){
            cb(mapKey);
        });
    }
    ],function(mapKey){
        console.log('Map Key: %s',mapKey);
        cb(mapKey);
    });
};

var genInfoFile = function(uid,mapKey,cb)
{
    async.waterfall([
        function(cb){
            buildingDAO.getBIDByName('President',function(BID)
                {
                    var data = BID+' 11 8 2 '+uid;
                    cb(data);
                }
            );
        }
    ],function(data){
        fs.writeFile(PATH+mapKey+'.info',data,function(err){
            if(err)
            {
                throw err;
            }
            else
            {

                cb(mapKey);
            }
        });
    });
};