/**
 * Created by Vodalok on 2014/8/13.
 */
var userDAO = require('../../../DAO/userDAO');
var generateUID = require('../../../shared/generateUID');
var Code = require('../../../shared/code');

module.exports = function(app)
{
    return new Remote(app);
};

var Remote = function(app)
{
    this.app = app;
};

Remote.prototype.dispatchUID = function(uid,cb)//callback:return status , uid
{
    if(uid==0) {
        userDAO.createWithUID(uid, function (err, resp) {
            if (err) {
                cb(err, null);
                return;
            }
            cb(null, {code: Code.OK, type:"create", uid: resp.uid.toString()});
        });
    }
    else
    {
        userDAO.isExistUID(uid,function(err,resp)
        {
            if(err)
            {
                cb(err,null);
                return;
            }
            cb(null,{code:Code.OK,type:"isExist",result:resp.result.toString()});
        });
    }
};