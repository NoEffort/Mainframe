const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Invalid Permissions!");
    
        let toKick = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if(!toKick) return message.channel.send("You did not specify a userID!");

        if(toKick.id === message.author.id) return message.channel.send("You cannot kick yourself!");
        if(toKick.highestRole.position >= message.member.highestRole.position) return message.channel.send("You cannot kick a Member with a higher role!");

        toKick.kick().then(member => {
            message.channel.send(`${toKick.user.tag} has been kicked!`);
        }).catch(err => {
            console.error(err);
    });
}

module.exports.help = {
    name: "kick"
}