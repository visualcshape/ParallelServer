/**
 * Created by Vodalok on 2014/8/13.
 */
var Code = require('../../../shared/code');
var async = require('async');
var dispatcher = require('../../../shared/dispatcher');

module.exports = function(app)
{
    return new Handler(app);
};

var Handler = function(app)
{
    this.app = app;
};

var handler = Handler.prototype;

/**
 * return
 * @param msg json
 * @param session no session currently
 * @param next err,data
 */
handler.authUIDAndDispatch = function(msg,session,next)
{
    var self = this;
    var uid = msg.uid;

    if(!uid){
        next(null,{code:Code.FAIL});
        return;
    }

    var connector = this.app.getServersByType('connector');
    if(!connector||connector.length===0)
    {
        next(null,{code:Code.GATE.FA_NO_SERVER_AVAILABLE});
        return;
    }
    //auth and dispatch uid
    self.app.rpc.auth.authRemote.dispatchUID(session,uid,function(err,resp)
    {
        if(err){
            next(err,{code:Code.FAIL});
            return;
        }

        if(resp.hasOwnProperty('uid'))
        {
            uid = resp.uid;
        }
        //dispatch connector
        var resToAppend = dispatcher.dispatchConnector(uid,connector);
        resp.connectorHost = resToAppend.host;
        resp.connectorPort = resToAppend.clientPort;
        next(null,{code:Code.OK,resp:resp});
    });
};
