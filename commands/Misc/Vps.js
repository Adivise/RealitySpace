const { EmbedBuilder } = require("discord.js");
const os = require('os');

module.exports = {
    config: {
        name: "vps",
        category: "Misc",
        description: "Shows the VPS stats",
        accessableby: "Members"
    },
    run: async (client, message, args) => {
        const totalSeconds = os.uptime();
        const realTotalSecs = Math.floor(totalSeconds % 60);
        const days = Math.floor((totalSeconds % (31536 * 100)) / 86400);
        const hours = Math.floor((totalSeconds / 3600) % 24);
        const mins = Math.floor((totalSeconds / 60) % 60);

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'VPS', iconURL: message.guild.iconURL({ dynamic: true }) })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setColor(client.color)
            .addFields(
                { name: 'Host', value: `${os.type()} ${os.release()} (${os.arch()})` },
                { name: 'CPU', value: `${os.cpus()[0].model}` },
                { name: 'Uptime', value: `${days} days, ${hours} hours, ${mins} minutes, and ${realTotalSecs} seconds` },
                { name: 'RAM', value: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB` },
                { name: 'Memory Usage', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB` },
                { name: 'CPU Load', value: `${(os.loadavg()[0]).toFixed(2)}%` },
                { name: 'CPU Cores', value: `${os.cpus().length}` },
            )
            .setFooter({ text: `Node.js ${process.version}` })
            .setTimestamp();

        return message.channel.send({ embeds: [embed] })
    }
}