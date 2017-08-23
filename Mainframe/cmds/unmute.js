const fs = module.require("fs");

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("MUTE_MEMBERS")) return message.channel.send("Invalid Permissions!");
    
    let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!toMute) return message.channel.send("You did not specify a userID!");

    if(toMute.id === message.author.id) return message.channel.send("You cannot unmute yourself!");
    if(toMute.highestRole.position >= message.member.highestRole.position) return message.channel.send("You cannot unmute a Member with a higher role!");
    
    let role = message.guild.roles.find(r => r.name === "botMuted");
    
    if(!role || !toMute.roles.has(role.id)) return message.channel.send("This user is not muted!");
            
    await toMute.removeRole(role);
    delete bot.mutes[toMute.id];
    
    fs.writeFile("./mutes.json", JSON.stringify(bot.mutes), err => {
        if(err) throw err;
        message.channel.send(`${toMute.user.tag} has been unmuted!`);
    })
 }
        
module.exports.help = {
    name: "unmute"
}