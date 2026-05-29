const { PermissionsBitField, ChannelType } = require("discord.js");

module.exports = async (client, oldState, newState) => {

	const player = client.manager.players.get(newState.guild.id);
	if (!player || player.destroyed) return;
	const botMember = newState.guild.members.me;

	if (!botMember.voice.channelId) {
		if (!player.destroyed) {
			await player.destroy().catch(() => { });
			await client.UpdateMusic(player);
			return;
		}
		return;
	}

	if (
		newState.channelId &&
		newState.channel?.type === ChannelType.GuildStageVoice &&
		botMember.voice.suppress
	) {
		if (
			botMember.permissions.has(PermissionsBitField.Flags.Speak) ||
			newState.channel?.permissionsFor(botMember)?.has(PermissionsBitField.Flags.Speak)
		) {
			await delay(2000);
			botMember.voice.setSuppressed(false).catch(() => { });
		}
	}

	if (oldState.id === client.user.id) return;
	if (!botMember.voice.channelId) return;
	if (player.data.get("stay")) return;

	if (botMember.voice.channelId === oldState.channelId) {
		const nonBots = botMember.voice.channel?.members.filter(
			(m) => !m.user.bot
		).size || 0;

		if (nonBots === 0) {
			await delay(client.config.LEAVE_EMPTY);

			const freshPlayer = client.manager.players.get(newState.guild.id);
			if (!freshPlayer || freshPlayer.destroyed) return;

			const currentChannel = botMember.voice.channel;
			if (!currentChannel) {
				await freshPlayer.destroy().catch(() => { });
				await client.UpdateMusic(freshPlayer);
				return;
			}
			const remainingUsers = currentChannel.members.filter(
				(m) => !m.user.bot
			).size;
			if (remainingUsers === 0) {
				await freshPlayer.destroy().catch(() => { });
				await client.UpdateMusic(freshPlayer);
			}
		}
	}
};

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}