const { EmbedBuilder } = require('discord.js');

module.exports = { 
    config: {
        name: "twentyfourseven",
        aliases: ["24/7", "24seven", "247"],
        description: "24/7 Music!",
        accessableby: "Member",
        category: "Music"
    },
    run: async (client, message, args) => {
        const msg = await message.channel.send(`Loading please wait....`);
    
        const player = client.manager.players.get(message.guild.id);
        if (!player) return msg.edit(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return msg.edit(`I'm not in the same voice channel as you!`);

        if (player.data.get("stay")) {
            await player.data.set("stay", false);

            const off = new EmbedBuilder()
                .setDescription("`🌙` | *Mode 24/7 has been:* `Deactivated`")
                .setColor(client.color);

            msg.edit({ content: " ", embeds: [off] });
        } else {
            await player.data.set("stay", true);

            const on = new EmbedBuilder()
                .setDescription("`🌕` | *Mode 24/7 has been:* `Activated`")
                .setColor(client.color);

            msg.edit({ content: " ", embeds: [on] });
        }
    }
};