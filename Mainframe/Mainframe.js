const botSettings = require("./settings.json");
const Discord = require("discord.js");
const fs = require("fs");

const PREFIX = botSettings.prefix;
const TOKEN = botSettings.token;

const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();
bot.mutes = require("./mutes.json");

fs.readdir("./cmds/", (err, files) => {
    if(err) console.error(err);

    let jsFiles = files.filter(f => f.split(".").pop() === "js");
    if(jsFiles.length <= 0) {
        console.log("No commands to load!");
        return;
    }

    console.log(`Loading ${jsFiles.length} commands!`);

    jsFiles.forEach((f, i) => {
        let props = require(`./cmds/${f}`);
        console.log(`${i + 1}: ${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });
});

bot.on("ready", async () => {
    console.log(`Bot is ready! ${bot.user.username}`);

    bot.setInterval(() => {
        for(let i in bot.mutes) {
            let time = bot.mutes[i].time;
            let guildId = bot.mutes[i].guild;
            let guild = bot.guilds.get(guildId);
            let member = guild.members.get(i);
            let botMuted = guild.roles.find(r => r.name === "botMuted");
            if(!botMuted) continue;

            if(Date.now() > time) {
                member.removeRole(botMuted);
                delete bot.mutes[i];

                fs.writeFile("./mutes.json", JSON.stringify(bot.mutes), err => {
                    if(err) throw err;
                    console.log(`${member.user.tag} has been automatically unmuted!`);
                });
            }
        }
    }, 5000)
});

bot.on("guildMemberAdd", member => {
    let newGuild = member.guild;
    newGuild.channels.get("249345920255262731").send(`Welcome ${member.user} to the server!`).catch(console.error);
});

bot.on("newRoleMember", function(server, user) {
    bot.addMemberToRole(user, server.roles.get("name", "MEMBER"), function(err) { if(err) console.error(err) })
});

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if(!command.startsWith(PREFIX)) return;

    let cmd = bot.commands.get(command.slice(PREFIX.length));
    if(cmd) cmd.run(bot, message, args);

});

bot.login(TOKEN);