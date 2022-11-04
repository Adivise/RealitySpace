const { EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: 'guildlist',
        category: 'Dev',
        description: 'Lists all guilds the bot is in',
        accessableby: "Owners"
    },
    ownerOnly: true,
    run: async (client, message, args) => {
        const guild = message.client.guilds.cache;
        const format = await guild.map(g => '\`' + g.id + `\` **|** \`` + g.name + `\` **|** \`` + g.memberCount + '\`') || 'None';

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: "Guild List", iconURL: client.user.displayAvatarURL() })
            .setDescription(format.splice(0, 10).join("\n"));

        message.channel.send({ embeds: [embed] });
    }
}