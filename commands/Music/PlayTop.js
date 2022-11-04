const { EmbedBuilder } = require('discord.js');
const { convertTime } = require("../../structures/ConvertTime.js");

module.exports = {
    config: {
        name: "playtop",
        description: "Play and queue song to the top!",
        usage: "<results>",
        category: "Music",
        accessableby: "Member",
        aliases: ["ptop", "topplay"]
    },
    run: async (client, message, args) => {
        const msg = await message.channel.send(`Loading please wait....`);
        
		const player = client.manager.get(message.guild.id);
		if (!player) return msg.edit(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return msg.edit(`I'm not in the same voice channel as you!`);

        if (!args[0]) return msg.edit(`Please provide a song name/link to play music.`);
        const search = args.join(" ");

        if (player.state != "CONNECTED") await player.connect();
        const res = await client.manager.search(search, message.author, player.node);

        if(res.loadType != "NO_MATCHES") {
            if(res.loadType == "TRACK_LOADED") {
                await player.queue.add(res.tracks[0]);

                playtop(player);

                const embed = new EmbedBuilder() //**Queued • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].duration, true)}\` • ${res.tracks[0].requester}
                    .setDescription(`*Shifted • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].duration)}\` • ${res.tracks[0].requester}`)
                    .setColor(client.color)

                msg.edit({ content: " ", embeds: [embed] });
                if(!player.playing) player.play();
            } else if(res.loadType == "PLAYLIST_LOADED") {
                const queues = player.queue.length;
                await player.queue.add(res.tracks);

                playtoppl(player, queues);

                const embed = new EmbedBuilder() //**Queued • [${res.playlist.name}](${search})** \`${convertTime(res.playlist.duration)}\` (${res.tracks.length} tracks) • ${res.tracks[0].requester}
                    .setDescription(`**Shifted • [${res.playlist.name}](${search})** \`${convertTime(res.playlist.duration)}\` (${res.tracks.length} tracks) • ${res.tracks[0].requester}`)
                    .setColor(client.color)

                msg.edit({ content: " ", embeds: [embed] });
                if(!player.playing) player.play();
            } else if(res.loadType == "SEARCH_RESULT") {
                await player.queue.add(res.tracks[0]);

                playtop(player);

                const embed = new EmbedBuilder()
                    .setDescription(`**Shifted • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].duration)}\` • ${res.tracks[0].requester}`)
                    .setColor(client.color)

                msg.edit({ content: " ", embeds: [embed] });
                if(!player.playing) player.play();
            } else if(res.loadType == "LOAD_FAILED") {
                msg.edit(`Error loading track failed`);
                player.destroy();
            }
        } else {
            msg.edit(`No results found for ${search}`);
            player.destroy();
        }
    }
}

function playtop(player) {
    const song = player.queue[player.queue.length - 1];

    player.queue.splice(player.queue.length - 1, 1);
    player.queue.splice(1 - 1, 0, song);
}

function playtoppl(player, queues) {
    let num = 0;
    for (let i = queues + 1; i < player.queue.length + 1; i++) {
        const song = player.queue[i - 1];
        player.queue.splice(i - 1, 1);
        player.queue.splice(num++, 0, song);
    }
}