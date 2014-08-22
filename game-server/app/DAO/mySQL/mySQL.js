/* mySQL.js
 * to create pool
 */
var mySQL = require('mySQL');

var SQLClient = module.exports;

var _pool;

var NND = {};

NND.init = function(app)
{
    var mySQLConfig = app.get('mySQLConfig');
    _pool = mySQL.createPool({
        host:mySQLConfig.host,
        user:mySQLConfig.username,
        password:mySQLConfig.password,
        database:mySQLConfig.database,
        connectionLimit:mySQLConfig.connectionLimit
    });
    console.log('[SQL]Pool created.');
};

/**
 * Do sql query.
 * @param sql sql statement
 * @param values escape values
 * @param cb callback:function(err,rows)
 */
NND.query = function(sql,values,cb)
{
    _pool.getConnection(function(err,connection)
    {
        if(err) console.log('[SQL]getConnection Error : '+err.stack);
        connection.query(sql,values,function(err,rows){
            connection.release();
            cb(err,rows);
        });
    });
};

NND.shutdown = function(app)
{

};

/**
 * init database.
 * @param app
 * @returns {Object}
 */
SQLClient.init = function(app)
{
    if(!!_pool)
    {
        return SQLClient;
    }else
    {
        NND.init(app);
        SQLClient.insert = NND.query;
        SQLClient.update = NND.query;
        SQLClient.delete = NND.query;
        SQLClient.query = NND.query;
        return SQLClient;
    }
};

SQLClient.shutdown = function(app)
{
  NND.shutdown(app);
};