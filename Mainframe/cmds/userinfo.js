const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {

    var random = Math.floor(Math.random() * 10) + 1;
    var newMessage;
    switch (random) {
        case 1:
            newMessage = "This is a random message!";
            break;
        case 2:
            newMessage = "What description?";
            break;
        case 3:
            newMessage = "Just put something under my name.";
            break;
        case 4:
            newMessage = "```java\nmessage.author.setDescription('Fancy Message')\n```";
            break;
        case 5:
            newMessage = "Nothing special.";
            break;
        case 6:
            newMessage = "Secretly Bill Cypher";
            break;
        case 7:
            newMessage = "<insert movie reference here>";
            break;
        case 8:
            newMessage = "Constructing more pylons!";
            break;
        case 9:
            newMessage = "I'm running out of ideas!";
            break;
        case 10:
            newMessage = "Laziness strikes again. Damn.";
            break;
        default:
            newMessage = "Invalid. Try again";
            break;
    }

    let embed = new Discord.RichEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL)
        .setDescription(newMessage)
        .setColor(message.member.displayHexColor)
        .addField("Username", `${message.author.username}#${message.author.discriminator}`, true)
        .addField("ID", `${message.author.id}`, true)
        .addField("Created At", `${message.author.createdAt}`);

    message.channel.send({embed: embed});
}

module.exports.help = {
    name: "userinfo"
}