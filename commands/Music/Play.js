const { convertTime } = require("../../structures/ConvertTime.js")
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = { 
    config: {
        name: "play",
        description: "Play a song!",
        usage: "<results>",
        category: "Music",
        accessableby: "Member",
        aliases: ["p", "pplay"]
    },
    run: async (client, message, args) => {
        const msg = await message.channel.send(`Loading please wait....`);
        
        const { channel } = message.member.voice;
		if (!channel) return msg.edit(`You are not in a voice channel`);
		if (!channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.Connect)) return msg.edit(`I don't have permission to join your voice channel!`);
		if (!channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.Speak)) return msg.edit(`I don't have permission to speak in your voice channel!`);

        if (!args[0]) return msg.edit(`Please provide a song name/link to play music.`);
        const search = args.join(" ");

        const player = await client.manager.create({
            region: message.member.voice.channel?.rtcRegion || undefined,
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: true,
        });

        if (player.state != "CONNECTED") await player.connect();
        const res = await client.manager.search(search, message.author, player.node);

        if(res.loadType != "NO_MATCHES") {
            if(res.loadType == "TRACK_LOADED") {
                await player.queue.add(res.tracks[0]);

                const embed = new EmbedBuilder() //**Queued • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].duration, true)}\` • ${res.tracks[0].requester}
                    .setDescription(`**Queued • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].duration)}\` • ${res.tracks[0].requester}`)
                    .setColor(client.color)

                msg.edit({ content: " ", embeds: [embed] });
                if(!player.playing) player.play();
            } else if(res.loadType == "PLAYLIST_LOADED") {
                await player.queue.add(res.tracks)

                const embed = new EmbedBuilder() //**Queued • [${res.playlist.name}](${search})** \`${convertTime(res.playlist.duration)}\` (${res.tracks.length} tracks) • ${res.tracks[0].requester}
                    .setDescription(`**Queued • [${res.playlist.name}](${search})** \`${convertTime(res.playlist.duration)}\` (${res.tracks.length} tracks) • ${res.tracks[0].requester}`)
                    .setColor(client.color)

                msg.edit({ content: " ", embeds: [embed] });
                if(!player.playing) player.play();
            } else if(res.loadType == "SEARCH_RESULT") {
                await player.queue.add(res.tracks[0]);

                const embed = new EmbedBuilder()
                    .setDescription(`**Queued • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].duration)}\` • ${res.tracks[0].requester}`)
                    .setColor(client.color)

                msg.edit({ content: " ", embeds: [embed] });
                if(!player.playing) player.play();
            } else if(res.loadType == "LOAD_FAILED") {
                msg.edit(`Error loading track failed`);
                player.destroy();
            }
        }
        else {
            msg.edit(`No results found for ${search}`);
            player.destroy();
        }
    }
}