const { EmbedBuilder } = require("discord.js");
const formatduration = require('../../structures/FormatDuration.js');
const { Database } = require("st.db");

const db = new Database(`./settings/models/control.json`, { databaseInObject: true });
    
module.exports = async (client, player, track, payload) => {
      const embed = new EmbedBuilder()
        .setAuthor({ name: `Starting playing...`, iconURL: `https://cdn.discordapp.com/emojis/741605543046807626.gif` })
        .setDescription(`**[${track.title}](${track.uri})**`)
        .setColor(client.color)
        .addFields({ name: `Author:`, value: `${track.author}`, inline: true })
        .addFields({ name: `Requester:`, value: `${track.requester}`, inline: true })
        .addFields({ name: `Volume:`, value: `${player.volume}%`, inline: true })
        .addFields({ name: `Queue Length:`, value: `${player.queue.length}`, inline: true })
        .addFields({ name: `Duration:`, value: `${formatduration(track.duration, true)}`, inline: true })
        .addFields({ name: `Total Duration:`, value: `${formatduration(player.queue.duration)}`, inline: true })
        .addFields({ name: `Current Duration: [0:00 / ${formatduration(track.duration, true)}]`, value: `\`\`\`🔴 | 🎶──────────────────────────────\`\`\``, inline: true })
        .setTimestamp();

        // track.thumbnail = get undefined = switch to avatar
        if (track.thumbnail) {
          embed.setThumbnail(`https://img.youtube.com/vi/${track.identifier}/hqdefault.jpg`);
        } else {
          embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }));
        }

    const database = await db.get(player.guild);
    if (database === true) {
      client.channels.cache.get(player.textChannel).send({ embeds: [embed] });
    }
}
