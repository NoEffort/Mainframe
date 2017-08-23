module.exports.run = async (bot, message, args) => {
    let msg = await message.channel.send("Generating Avatar...");

    if(!message.guild.iconURL) return msg.edit("No Icon.");

    message.channel.send({files: [
        {
            attachment: message.guild.iconURL,
            name: "icon.png"
        }
    ]});

    msg.delete();
}

module.exports.help = {
    name: "icon"
}