const { EmbedBuilder } = require("discord.js");
const { convertTime } = require("../../structures/ConvertTime.js");

module.exports = { 
    config: {
        name: "remove",
        description: "Remove song from queue!",
        usage: "<number>",
        category: "Music",
        accessableby: "Member",
        aliases: ["rt", "rs"],
    },
    run: async (client, message, args) => {
        const msg = await message.channel.send(`Loading please wait....`);
        
		const player = client.manager.get(message.guild.id);
		if (!player) return msg.edit(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return msg.edit(`I'm not in the same voice channel as you!`);

        const tracks = args[0];

        if (isNaN(tracks)) return msg.edit(`Please enter a valid number in the queue! ${client.prefix}remove <number>`);

        if (tracks == 0) return msg.edit(`Cannot remove a song that is already playing.`);
        if (tracks > player.queue.length) return msg.edit(`Song not found.`);

        const song = player.queue[tracks - 1];

        await player.queue.splice(tracks - 1, 1);

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`**Removed • [${song.title}](${song.uri})** \`${convertTime(song.duration, true)}\` • ${song.requester}`)

        return msg.edit({ content: " ", embeds: [embed] });
    }
}