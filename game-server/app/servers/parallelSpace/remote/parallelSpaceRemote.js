/**
 * Created by Vodalok on 2014/10/14.
 */
//TODO : add user to this space and update their resources

module.exports = function(app)
{
    return new parallelSpaceRemote(app);
};

var parallelSpaceRemote = function(app)
{
    this.app = app;
    this.channelService = app.get('channelService');
};

parallelSpaceRemote.prototype.add = function(uid,serverID,rid,flag,cb)
{
    var self = this;
    var channel = this.channelService.getChannel(rid,flag);
    var param = {
        route:'onAdd',
        uid:uid
    };
    //don't push

    if(!!channel) {
        channel.add(uid, serverID);
        console.log('Channel %s add %s',channel,uid);
    }

    cb();
    //cb(this.getByUID(rid,flag));
};

parallelSpaceRemote.prototype.getByUID = function(rid,flag)
{
    var returnUser;
    var channel = self.channelService.getChannel(rid,flag);

    if(!!channel)
    {

    }
};

parallelSpaceRemote.prototype.kick = function(uid,ServerID,rid,cb)
{
    var channel = this.channelService.getChannel(rid,false);
    if(!!channel)
    {
        channel.leave(uid,ServerID);
    }
    //don't push msg.
    cb();
};