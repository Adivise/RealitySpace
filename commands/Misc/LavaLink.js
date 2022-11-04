const { EmbedBuilder } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const prettyBytes = require("pretty-bytes");

module.exports = {
    config: {
        name: "lavalink",
        category: "Misc",
        description: "Shows the Lavalink stats",
        accessableby: "Members"
    },
    run: async (client, message, args) => {
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `LavaLink`, iconURL: message.guild.iconURL({ dynamic: true })})
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setFooter({ text: `LavaLink v3.6.1 | Java 11` })
            .setTimestamp()

        client.manager.nodes.forEach((node) => {
            try {
                embed.addFields({ name: "Name", value: `${node.options.identifier}` })
                embed.addFields({ name: "Connected", value: `${node.connected ? "Connected [🟢]" : "Disconnected [🔴]"}` })
                embed.addFields({ name: "Player", value: `${node.stats.players}` })
                embed.addFields({ name: "Used Players", value: `${node.stats.playingPlayers}` })
                embed.addFields({ name: "Uptime", value: `${moment.duration(node.stats.uptime).format("d [days], h [hours], m [minutes], s [seconds]")}` })
                embed.addFields({ name: "Cores", value: `${node.stats.cpu.cores + " Core(s)"}` })
                embed.addFields({ name: "Memory Usage", value: `${prettyBytes(node.stats.memory.used)}/${prettyBytes(node.stats.memory.reservable)}` })
                embed.addFields({ name: "System Load", value: `${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%` })
                embed.addFields({ name: "Lavalink Load", value: `${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%` })
            } catch (e) {
                console.log(e);
            }
        });

        return message.channel.send({ embeds: [embed] });
    }
}