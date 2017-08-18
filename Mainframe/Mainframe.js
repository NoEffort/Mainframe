const botSettings = require("./settings.json");
const Discord = require("discord.js");

const PREFIX = botSettings.prefix;
const TOKEN = botSettings.token;

const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () => {
    console.log(`Bot is ready! ${bot.user.username}`);
});

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if(!command.startsWith(PREFIX)) return;

    if(command === `${PREFIX}userinfo`) {
        let embed = new Discord.RichEmbed()
            .setAuthor(message.author.username)
            .setDescription("info")
            .setColor("#67f4f1")
            .addField("Full Username", `${message.author.username}#${message.author.discriminator}`)
            .addField("ID", `${message.author.id}`)
            .addField("Created At", `${message.author.createdAt}`);

        message.channel.sendEmbed(embed);
        return;
    }

    if(command === `${PREFIX}mute`) {
        if(!message.member.hasPermission("MUTE_MEMBERS")) return message.channel.sendMessage("Invalid Permissions!");

        let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if(!toMute) return message.channel.sendMessage("You did not specify a userID!");

        let role = message.guild.roles.find(r => r.name === "botMuted");
        if(!role) {
            try {
                role = await message.guild.createRole({
                    name: "botMuted",
                    color: "#000000",
                    permissions: []
                });
    
                message.guild.channels.forEach(async (channel, id) => {
                    await channel.overwritePermissions(role, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    });
                });
            } catch(e) {
                console.log(e.stack);
            }
        }

        if(toMute.roles.has(role.id)) return messsage.channel.sendMessage("This user is already muted!");
        
        await toMute.addRole(role);
        message.channel.sendMessage("User has been muted!");

        return;
    }

    if(command === `${PREFIX}unmute`) {
        if(!message.member.hasPermission("MUTE_MEMBERS")) return message.channel.sendMessage("Invalid Permissions!");

        let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if(!toMute) return message.channel.sendMessage("You did not specify a userID!");

        let role = message.guild.roles.find(r => r.name === "botMuted");

        if(!role || !toMute.roles.has(role.id)) return messsage.channel.sendMessage("This user is not muted!");
        
        await toMute.removeRole(role);
        message.channel.sendMessage("User has been unmuted!");

        return;
    }

    if(command === `${PREFIX}help`) {
        let embed = new Discord.RichEmbed()
            .setDescription("I cannot help you. Try something else.");
        
        message.channel.sendEmbed(embed);
    }

    if(command === `${PREFIX}kill`) {
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.sendMessage("Invalid Permissions!");

        message.channel.sendMessage(`Killing ${bot.user.username}...`);
        console.log(`${bot.user.username} was killed.`);
        bot.destroy((err) => {});
        return;
    }
});

bot.login(TOKEN);