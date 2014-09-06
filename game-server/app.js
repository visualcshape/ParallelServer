var pomelo = require('pomelo');
var mySQLClient = require('./app/DAO/mySQL/mySQL');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'Parallelformosa');

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.hybridconnector,
      heartbeat : 3,
      useDict : true,
      useProtobuf : true
    });
});
//global configure
app.configure('production|development',function()
{
    //route..
    //no route need to be set..
});

//gate configure
app.configure('production|development','gate',function()
{
   app.set('connectorConfig',
       {
           connector:pomelo.connectors.hybridconnector,
           useProtobuf:true
       });
});
//auth configure
app.configure('production|development','auth',function()
{
    //nothing to do here now...
});
//connector configure
app.configure('production|development','connector',function()
{
   app.set('connectorConfig',
       {
          connector:pomelo.connectors.hybridconnector,
           heartbeat:30,
           useProtobuf:true
       });
});

//DB configure
app.configure('development|production',function()
{
    app.loadConfig('mySQLConfig',app.getBase()+'/config/mysql.json');
    var dbClient = require('./app/DAO/mySQL/mySQL').init(app);
    app.set('dbClient',dbClient);

});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
