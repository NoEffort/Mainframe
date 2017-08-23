const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {
    let embed = new Discord.RichEmbed()
    .setDescription("I cannot help you. Try something else.");
    
    message.channel.send({embed: embed});
}

module.exports.help = {
    name: "help"
}