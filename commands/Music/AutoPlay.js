const { EmbedBuilder } = require('discord.js');

module.exports = { 
    config: {
        name: "autoplay",
        aliases: ["ap"],
        description: "Auto play music in voice channel.",
        accessableby: "Member",
        category: "Music"
    },
    run: async (client, message, args) => {
        const msg = await message.channel.send(`Loading please wait....`);

        const player = client.manager.players.get(message.guild.id);
        if (!player) return msg.edit(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return msg.edit(`I'm not in the same voice channel as you!`);

        const autoplay = player.data.get("autoplay");
        
        if (autoplay === true) {
            await player.data.set("autoplay", false);
            await player.queue.clear();

            const off = new EmbedBuilder()
            .setDescription("`📻` | *Autoplay has been:* `Deactivated`")
            .setColor(client.color);

            msg.edit({ content: " ", embeds: [off] });
        } else {
            const identifier = player.queue.current.identifier;
            const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
            const res = await player.search(search, { requester: message.author });
            if (!res.tracks.length) return message.reply(`Engine \`${player.queue.current.sourceName}\` not support!`);

            await player.data.set("autoplay", true);
            await player.data.set("requester", message.author);
            await player.data.set("identifier", identifier);
            await player.queue.add(res.tracks[1]);

            const on = new EmbedBuilder()
            .setDescription("`📻` | *Autoplay has been:* `Activated`")
            .setColor(client.color);

            msg.edit({ content: " ", embeds: [on] });
        }
    }
};