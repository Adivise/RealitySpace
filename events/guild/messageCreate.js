const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");

module.exports = async (client, message) => { 
    if(message.author.bot || message.channel.type === 1) return;

    const prefix = client.prefix;

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if(message.content.match(mention)) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`My prefix is: \`${prefix}\``);
      message.channel.send({ embeds: [embed] })
    };

    await client.createControl(message);

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [ matchedPrefix ] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if(!command) return;

    if (!client.dev.includes(message.author.id) && client.dev.length > 0) { 
      message.channel.send(`${message.author}, You are not a developer!`);
      console.log(`[WARN] - ${message.author.tag} trying request the command from ${message.guild.name} (Not a developer)`); 
      return;
    }
    // guild 
    const db = new Database(`./settings/models/access.json`, { databaseInObject: true });
    const database = await db.get("whitelist");
    if (!database.includes(message.guild.id) && database.length > 0) {
      message.channel.send(`${message.author}, Donate: <https://ko-fi.com/nanotect> **Minimum: 100 THB (2.63 USD)** to get access all bots!\n**More Details:** <https://urlis.net/buy-whitelist>`);
      console.log(`[WARN] - ${message.author.tag} trying request the command from ${message.guild.name} (Not Whitelisted)`);
      return;
    }

    console.log(`[COMMAND] - ${command.config.name} executed by ${message.author.tag} | ${client.user.username} in ${message.guild.name} (${message.guild.id})`);

    if(!message.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return message.author.dmChannel.send(`${message.author}, I don't have permission to send messages in ${message.guild.name}!`);
    if(!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewChannel)) return;
    if(!message.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return message.channel.send(`${message.author}, I don't have permission to embed links in ${message.guild.name}!`);
    if(!message.guild.members.me.permissions.has(PermissionsBitField.Flags.Speak)) return message.channel.send(`${message.author}, I don't have permission to speak in ${message.guild.name}!`);
    if(!message.guild.members.me.permissions.has(PermissionsBitField.Flags.Connect)) return message.channel.send(`${message.author}, I don't have permission to connect to voice channels in ${message.guild.name}!`);
    
    try {
      if (command.ownerOnly) {
        if (message.author.id !== client.owner) {
            return message.channel.send(`${message.author}, You are not the owner!`);
        }
    }
      command.run(client, message, args);
    } catch (error) {
      console.log(error)
      await message.channel.send(`${message.author}, an error occured!`);
    }
}