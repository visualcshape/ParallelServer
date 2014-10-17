/**
 * Created by Vodalok on 2014/10/17.
 */
var pomelo = require('pomelo');

var buildingDAO = module.exports;

buildingDAO.getBIDByName = function(name,cb)
{
    var dbClient = pomelo.app.get('dbClient');

    var sql = 'SELECT GID FROM BuildingType WHERE Name=?';
    var value = [name];

    dbClient.query(sql,value,function(err,resp)
    {
        if(err)
        {
            throw err;
        }
        if(resp.length==0)
        {
            throw Error('No such building name');
        }

        cb(resp[0].GID);
    });
};