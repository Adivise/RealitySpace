const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { Database } = require("st.db");

module.exports = { 
    config: {
        name: "join",
        aliases: ["summon"],
        description: "Makes the bot join the voice channel.",
        accessableby: "Member",
        category: "Music",
    },
    run: async (client, message, args) => {
        const msg = await message.channel.send(`Loading please wait....`);

        const { channel } = message.member.voice;
        if(!channel) return msg.edit(`You are not in a voice channel`);
		if (!channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.Connect)) return msg.edit(`I don't have permission to join your voice channel!`);
		if (!channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.Speak)) return msg.edit(`I don't have permission to speak in your voice channel!`);

        // list channel who in voice channel
        const list = await message.member.guild.channels.fetch(channel.id);
        const members = list.members.map(m => m);
        const bot = members.filter(m => m.user.bot === true).map(m => m.user.id);
        // Can't have 2 bot in 1 voice channel
        const controlDB = new Database('./settings/models/control.json', { databaseInObject: true });
        const botBypass = await controlDB.get(`${message.guild.id}_botbypass`);
        const isOwner = message.author.id === client.owner;
        if (!botBypass && !isOwner) {
            if (!bot.includes(client.user.id) && bot.length >= 1) {
                return msg.edit(`You can't use 2 bot in 1 voice channel!`);
            }
        }

        client.manager.createPlayer({
            guildId: message.guild.id,
            textId: message.channel.id,
            voiceId: channel.id,
            volume: 100,
            deaf: true
        });

        const embed = new EmbedBuilder()
            .setDescription(`\`🔊\` | *Joined:* \`${channel.name}\``)
            .setColor(client.color)

        msg.edit({ content: " ", embeds: [embed] })
    }
}
