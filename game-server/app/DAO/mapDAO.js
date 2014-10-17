/**
 * Created by Vodalok on 2014/10/15.
 */
var pomelo = require('pomelo');

var mapDAO = module.exports;

mapDAO.isMapInhibit = function(mapKey,cb)
{
    var sql = 'select * from MapUserAlreadyExist where MapID = ?';
    var values = [mapKey];

    var dbClient = pomelo.app.get('dbClient');

    dbClient.query(sql,values,function(err,resp)
    {
        if(err)
        {
            console.error(err);
            throw err;
        }
        else
        {
            if(resp.length==0)
            {
                cb(false,null);
            }
            else
            {
                var inhibitUID = resp[0].InhibitID;
                cb(true,inhibitUID);
            }
        }
    });
};

mapDAO.insertInhibitMap = function(mapKey,uid,cb)
{
    var sql = 'insert into MapUserAlreadyExist(MapID,InhibitID) values (?,?) ';
    var values = [mapKey,uid];

    var dbClient = pomelo.app.get('dbClient');
    dbClient.query(sql,values,function(err,resp){
        if(err)
        {
            console.error(err);
            throw err;
        }
        else
        {
            cb(null);
        }
    });
};