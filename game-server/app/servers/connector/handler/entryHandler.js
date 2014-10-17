var async = require('async');
var code = require('../../../shared/code');
var userDAO = require('../../../DAO/userDAO');
var dispatcher = require('../../../shared/dispatcher');
var fs = require('fs');

var httpHostIP = '220.133.209.239';
var httpHostPort = '31000';

module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
    if (!this.app) {
        console.error(app);
    }
};

var pro = Handler.prototype;

pro.entry = function (msg, session, next) {
    var self = this;
    var user;
    var rid = 0;
    var response = {};
    var infoDownloadPath = '';

    var uid = msg.uid;
    var firstLogin = msg.firstLogin;
    if (firstLogin == '1') {
        async.waterfall(
            [
                function (cb) {
                    userDAO.createFirstTimeUser(uid, cb);
                },
                function (userReturn, cb) {
                        user = userReturn;
                        //add to response
                        infoDownloadPath = 'http://' + httpHostIP + ':' + httpHostPort + '/tmxAndInfo/' + user.OwnMapCoord + '.info';
                        cb(null);
                },
                function (cb) {
                    //bind seesion
                    session.bind(uid);
                    session.set('rid', rid);
                    session.set('user', user);
                    session.on('closed', onUserLeave.bind(null, self.app));
                    cb(null);
                },
                function (cb) {
                    session.pushAll(cb);
                },
                function  (cb) {
                    //add to online list
                    console.log('Arrived');
                    self.app.rpc.parallelSpace.parallelSpaceRemote.add(session,uid, self.app.get('serverId'), rid, true, cb);
                }
            ], function (err) {
                next(null, {infoDownloadPath: infoDownloadPath, user: user});
            }
        );
    }
    else {
        async.waterfall(
            [
                function (cb) {
                    userDAO.queryUser(uid, cb);
                },
                function (userReturn, cb) {
                    user = userReturn;
                    //add to response
                    infoDownloadPath = 'http://' + httpHostIP + ':' + httpHostPort + '/tmxAndInfo/' + user.OwnMapCoord + '.info';
                    cb(null);
                },
                function (cb) {
                    //bind seesion
                    session.bind(uid);
                    session.set('rid', rid);
                    session.set('user', user);
                    session.on('closed', onUserLeave.bind(null, self.app));
                    cb(null);
                },
                function (cb) {
                    session.pushAll(cb);
                },
                function  (cb) {
                    //add to online list
                    console.log('Arrived');
                    self.app.rpc.parallelSpace.parallelSpaceRemote.add(session,uid, self.app.get('serverId'), rid, true, cb);
                }
            ], function () {
                next(null, {infoDownloadPath: infoDownloadPath, user: user});
            }
        );
    }
};

pro.build = function (msg, session, next) {
};

var onUserLeave = function (app, session) {
    if (!session || !session.uid) {
        return;
    }

    app.rpc.parallelSpace.parallelSpaceRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);
};