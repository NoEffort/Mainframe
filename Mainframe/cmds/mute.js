const fs = module.require("fs");

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("MUTE_MEMBERS")) return message.channel.send("Invalid Permissions!");
    
            let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
            if(!toMute) return message.channel.send("You did not specify a userID!");
    
            if(toMute.id === message.author.id) return message.channel.send("You cannot mute yourself!");
            if(toMute.highestRole.position >= message.member.highestRole.position) return message.channel.send("You cannot mute a Member with a higher role!");
    
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
    
            if(toMute.roles.has(role.id)) return message.channel.send("This user is already muted!");
            
            bot.mutes[toMute.id] = {
                guild: message.guild.id,
                time: Date.now() + parseInt(args[1]) * 1000
            }

            fs.writeFile("./mutes.json", JSON.stringify(bot.mutes, null, 4), err => {
                if(err) throw err;
                message.channel.send(`${toMute.user.tag} has been muted!`);
            });

            await toMute.addRole(role);
}

module.exports.help = {
    name: "mute"
}