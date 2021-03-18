// Import the library
const discord = require("js-cord");
// Declare your bot
const bot = new discord.Bot({ prefix: "!" });

// Notify us in the console when the bot is ready
bot.listen("ready", () => {
    console.log(`Logged in as ${bot.user}`);
})

// Advanced ping command
// Note that we need to make this asynchronous
bot.command("ping", async (ctx) => {
    let websocket = bot.latency;
    let typing = Date.now();
    let original = await ctx.send("Loading...");
    typing = Math.round(Date.now() - typing);
    await original.edit(`Pong!\n**Websocket:** ${websocket} ms\n**Typing:** ${typing} ms`);
});

// Log in to Discord.
bot.login("token"); 
/**
 * Your token is found on the Bot tab of your bot's application page.
 * https://discord.com/developers/applications
*/