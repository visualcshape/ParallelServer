//userDAO.js

var mySQLClient = require('./mySQL/mySQL');
var pomelo = require('pomelo');
var utils = require('../shared/utils');
var Code = require('../shared/code');
var dispatcher = require('../shared/dispatcher');
var User = require('../Domain/Entities/User');
var async = require('async');
var fs = require('fs');

var userDAO = module.exports;

/**
 *
 * @param uid uid to create
 * @param cb callback err response
 */
userDAO.createWithUID = function (uid, cb) {
    var sql = 'insert into User (ID) values(?)';
    uid = Date.now();
    var values = [uid];

    pomelo.app.get('dbClient').insert(sql, values, function (err, resp) {
        if (err) {
            console.error('[CreateWithUID]' + err);
            cb({code: err.number, msg: err.message}, null);
        } else {
            cb(null, {code: Code.OK, uid: uid});
        }
    });
};

userDAO.isExistUID = function (uid, cb) {
    var sql = 'select ID from User where ID = (?)';
    var values = [uid];

    pomelo.app.get('dbClient').query(sql, values, function (err, resp) {
        if (err != null) {
            cb({code: err.number, msg: err.message}, null);
        } else {
            if (resp.length == 0) {
                cb(null, {code: Code.OK, result: false});
                return;
            }
            cb(null, {code: Code.OK, result: true});
        }
    });
};

userDAO.createFirstTimeUser = function (uid, ccb) {
    var opts = {};

    async.waterfall([function (cb) {
        dispatcher.dispatchMapCoord(uid, function (respMapKey) {
            var mapKey = respMapKey;
            cb(null,mapKey);
        });
    }, function (mapKey, cb) {
        var sql = 'update User set OwnMapCoord=? where ID = ?';
        var value = [mapKey, uid];
        var dbClient = pomelo.app.get('dbClient');
        dbClient.query(sql, value, function (err, resp) {
            if (err) {
                throw err;
            }
            else {
                if (resp.affectedRows == 0) {
                    throw Error('No rows changed');
                }
                else {
                    console.log('Row change : %s rows', resp.affectedRows);
                    cb(null);
                }
            }
        });
    },function(cb){
        var sql = 'SELECT * FROM User WHERE ID = ?';
        var value = [uid];
        var dbClient = pomelo.app.get('dbClient');

        dbClient.query(sql, value, function (err, resp) {
                if (err) {
                    console.error(err.stack);
                    throw err;
                }
                else {
                    if (resp.length == 0) {
                        throw Error('No such ID');
                    }
                    else {
                        opts = {
                            OwnMapCoord: resp[0].OwnMapCoord,
                            GPower: resp[0].GPower,
                            LMana: resp[0].LMana,
                            Food: resp[0].Food,
                            GPowerGenRate: resp[0].GPowerGenRate,
                            LManaGenRate: resp[0].LManaGenRate,
                            FoodGenRate: resp[0].FoodGenRate,
                            GPowerGenLevel: resp[0].GPowerGenLevel,
                            LManaGenLevel: resp[0].LManaGenLevel,
                            FoodGenLevel: resp[0].FoodGenLevel,
                            BarrackLevel: resp[0].BarrackLevel
                        };
                        var user = new User(opts);
                        console.log("Pass");
                        cb(null,user);
                    }
                }
            }
        );
    }
    ], function (err,user) {
        ccb(null,user);
    });
};

userDAO.queryUser = function (uid, ccb) {
    var opts = {};
    var sql = 'SELECT * FROM User WHERE ID = ?';
    var value = [uid];
    var dbClient = pomelo.app.get('dbClient');

    async.waterfall([
        function(cb) {
            dbClient.query(sql, value, function (err, resp) {
                    if (err) {
                        console.error(err.stack);
                        throw err;
                    }
                    else {
                        if (resp.length == 0) {
                            throw Error('No such ID');
                        }
                        else {
                            opts = {
                                OwnMapCoord: resp[0].OwnMapCoord,
                                GPower: resp[0].GPower,
                                LMana: resp[0].LMana,
                                Food: resp[0].Food,
                                GPowerGenRate: resp[0].GPowerGenRate,
                                LManaGenRate: resp[0].LManaGenRate,
                                FoodGenRate: resp[0].FoodGenRate,
                                GPowerGenLevel: resp[0].GPowerGenLevel,
                                LManaGenLevel: resp[0].LManaGenLevel,
                                FoodGenLevel: resp[0].FoodGenLevel,
                                BarrackLevel: resp[0].BarrackLevel
                            };
                            var user = new User(opts);
                            cb(null, user);
                        }
                    }
                }
            )
        },
        //validate
        function(err,user,cb){
            var path = __dirname+'/../../tmxAndInfo/'+user.OwnMapCoord;

            fs.exists(path,function(exist){
                if(exist)
                    throw Error('Error: No info '+path+'Exist');
                else
                    cb(user);
            });
        }
    ],function(user){
        ccb(null,user);
    });
};
