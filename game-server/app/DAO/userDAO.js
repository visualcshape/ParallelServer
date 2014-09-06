//userDAO.js

var mySQLClient = require('./mySQL/mySQL');
var pomelo = require('pomelo');
var utils = require('../shared/utils');
var Code = require('../shared/code');

var userDAO = module.exports;

/**
 *
 * @param uid uid to create
 * @param cb callback err response
 */
userDAO.createWithUID = function(uid,cb)
{
    var sql = 'insert into User (ID) values(?)';
    uid = Date.now();
    var values = [uid];

    pomelo.app.get('dbClient').insert(sql,values,function(err,resp)
    {
        if(err)
        {
            console.error('[CreateWithUID]'+err);
            cb({code:err.number,msg:err.message},null);
        }else
        {
            cb(null,{code:Code.OK,uid:uid});
        }
    });
};

userDAO.isExistUID = function(uid,cb)
{
    var sql = 'select ID from User where ID=?';
    var values = [uid];

    pomelo.app.get('dbClient').query(sql,values,function(err,resp)
    {
       if(err!=null) {
           cb({code:err.number,msg:err.message},null);
       }else
       {
           if(resp.length==0)
           {
               cb(null,{code:Code.OK,result:false});
               return;
           }
           cb(null,{code:Code.OK,result:true});
       }
    });
};