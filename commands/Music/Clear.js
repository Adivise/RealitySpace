const { EmbedBuilder } = require('discord.js');

module.exports = { 
    config: {
        name: "clear",
        aliases: ["c"],
        description: "Clear song in queue!",
        accessableby: "Member",
        category: "Music",
    },
    run: async (client, message, args) => {
        const msg = await message.channel.send(`Loading please wait....`);

		const player = client.manager.players.get(message.guild.id);
		if (!player) return msg.edit(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return msg.edit(`I'm not in the same voice channel as you!`);

        await player.queue.clear();
        
        const cleared = new EmbedBuilder()
            .setDescription("`📛` | *Queue has been:* `Cleared`")
            .setColor(client.color);

        msg.edit({ content: " ", embeds: [cleared] });
    }
}