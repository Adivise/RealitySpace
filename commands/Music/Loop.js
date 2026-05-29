const { EmbedBuilder } = require('discord.js');

module.exports = {
	config: {
		name: "loop",
		aliases: ["repeat"],
		description: "Loop song in queue!",
		accessableby: "Member",
		category: "Music",
		usage: "<current, all>"
	},
	run: async (client, message, args) => {
		const msg = await message.channel.send(`Loading please wait....`);

		const player = client.manager.players.get(message.guild.id);
		if (!player) return msg.edit(`No playing in this guild!`);
		const { channel } = message.member.voice;
		if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return msg.edit(`I'm not in the same voice channel as you!`);

		if (!args[0] || args[0].toLowerCase() == 'current') {
			if (player.loop === "none") {
				player.setLoop("track");

				const looped = new EmbedBuilder()
					.setDescription(`\`🔁\` | *Song has been:* \`Looped\``)
					.setColor(client.color);

				msg.edit({ content: " ", embeds: [looped] });
			}
			else {
				player.setLoop("none");

				const unlooped = new EmbedBuilder()
					.setDescription(`\`🔁\` | *Song has been:* \`Unlooped\``)
					.setColor(client.color);

				msg.edit({ content: " ", embeds: [unlooped] });
			}
		} else if (args[0].toLowerCase() == 'all' || args[0].toLowerCase() == 'queue') {
			if (player.loop === "queue") {
				player.setLoop("none");

				const unloopall = new EmbedBuilder()
					.setDescription(`\`🔁\` | *Loop all has been:* \`Disabled\``)
					.setColor(client.color);

				msg.edit({ content: " ", embeds: [unloopall] });
			}
			else {
				player.setLoop("queue");

				const loopall = new EmbedBuilder()
					.setDescription(`\`🔁\` | *Loop all has been:* \`Enabled\``)
					.setColor(client.color);

				msg.edit({ content: " ", embeds: [loopall] });
			}
		}
	}
};