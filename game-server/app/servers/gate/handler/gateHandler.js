/**
 * Created by Vodalok on 2014/8/13.
 */
var Code = require('../../../shared/code');
var async = require('async');

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
handler.authUID = function(msg,session,next)
{
    var self = this;
    var uid = msg.uid;

    self.app.rpc.auth.authRemote.dispatchUID(session,uid,function(err,resp)
    {
        if(err){
            next(err,{code:Code.FAIL});
            return;
        }
        next(null,{code:Code.OK,resp:resp});
    });
};
