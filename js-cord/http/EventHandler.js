const ClientUser = require("../strucutres/ClientUser");
const Message = require("../structures/Message");

module.exports = function handleEvent(client, event, data) {
    event = event.toUpperCase().replace(" ", "_");
    if (event === "READY") {
        this.client.emit("ready");
        this.client.user = new ClientUser(client, data['user']);
    } else if (event === "RESUMED") {
        this.client.emit("resumed");
    } else if (event === "RECONNECT") {
        this.client.emit("reconnect") 
    } 

    // implement on_ready_whitelist
    /**
     *   WSEvents.READY,
  WSEvents.RESUMED,
  WSEvents.GUILD_CREATE,
  WSEvents.GUILD_DELETE,
  WSEvents.GUILD_MEMBERS_CHUNK,
  WSEvents.GUILD_MEMBER_ADD,
  WSEvents.GUILD_MEMBER_REMOVE,
     */

    // channels
    else if (event === "CHANNEL_CREATE") {
        this.client.emit("channel")
    } // wip because channel support is currently partial

    // messages
    else if (event === "MESSAGE_CREATE") {
        this.client.emit("message", Message.fromData(data));
        // somehow, we add this message to the cache
    } // we need to make a message cache, or else 
    // MESSAGE_EDIT/MESSAGE_DELETE won't be able to take payloads
    else if (event === "MESSAGE_UPDATE") {
        this.client.emit("messageEdit", null /*some way to get the old message*/, Message.fromData(data));
    } else if (event === "MESSAGE_DELETE") {
        this.client.emit("messageDelete", null /*again, some way to get the old message*/)
    } else if (event === "MESSAGE_DELETE_BULK") {
        this.client.emit("messageBulkDelete", null /*what i said above, but iterate through id's*/)
    }
}