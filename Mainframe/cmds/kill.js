module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Invalid Permissions!");
    
    message.channel.send(`Killing ${bot.user.username}...`);
    console.log(`${bot.user.username} was killed.`);
    bot.destroy((err) => {});
 }
        
module.exports.help = {
    name: "kill"
}