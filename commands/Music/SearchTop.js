const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { convertTime } = require("../../structures/ConvertTime.js");

module.exports = { 
    config: {
        name: "searchtop",
        description: "Search a song and queue to the top!",
        usage: "<result>",
        category: "Music",
        accessableby: "Member",
        aliases: ["topsearch", "tsearch"],
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

        const row = new  ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("one")
            .setEmoji("1️⃣")
            .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("two")
            .setEmoji("2️⃣")
            .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("three")
            .setEmoji("3️⃣")
            .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("four")
            .setEmoji("4️⃣")
            .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("five")
            .setEmoji("5️⃣")
            .setStyle(ButtonStyle.Secondary)
        )
        
        if(res.loadType != "NO_MATCHES") {
            if(res.loadType == "TRACK_LOADED") {
                await player.queue.unshift(res.tracks[0]);

                playtop(player);

                const embed = new EmbedBuilder() //`**Shifted • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].duration, true)}\` • ${res.tracks[0].requester}
                    .setDescription(`**Shifted • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].duration, true)}\` • ${res.tracks[0].requester}`)
                    .setColor(client.color)

                msg.edit({ content: " ", embeds: [embed] });
                if (!player.playing) player.play();
            } else if (res.loadType == "SEARCH_RESULT") {
                let index = 1;
                const results = res.tracks
                    .slice(0, 5) //**(${index++}.) [${video.title}](${video.uri})** \`${convertTime(video.duration)}\` Author: \`${video.author}\`
                    .map(video => `**(${index++}.) [${video.title}](${video.uri})** \`${convertTime(video.duration)}\` Author: \`${video.author}\``)
                    .join("\n");
                const playing = new EmbedBuilder()
                    .setAuthor({ name: `Song Selection...`, iconURL: message.guild.iconURL({ dynamic: true }) })
                    .setColor(client.color)
                    .setDescription(results)
                    .setFooter({ text: `Please Respone in 30s | Type *cancel* to Cancel` })
                await msg.edit({ content: " ", embeds: [playing], components: [row] });

                const collector = msg.createMessageComponentCollector({ filter: (interaction) => interaction.user.id === message.author.id ? true : false && interaction.deferUpdate(), max: 1, time: 30000 });

                collector.on('collect', async (interaction) => {
                    if(!interaction.deferred) await interaction.deferUpdate();
                    if(!player && !collector.ended) return collector.stop();
                    const id = interaction.customId;

                    if(id === "one") {
                        await player.queue.unshift(res.tracks[0]);

                        playtop(player);

                        const embed = new EmbedBuilder() //**Shifted • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].duration, true)}\` • ${res.tracks[0].requester}
                            .setDescription(`**Shifted • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].duration, true)}\` • ${res.tracks[0].requester}`)
                            .setColor(client.color)
        
                        if(msg) await msg.edit({ embeds: [embed], components: [] });
                        if(player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();
                    } else if(id === "two") {
                        await player.queue.unshift(res.tracks[1]);

                        playtop(player);

                        const embed = new EmbedBuilder() //**Shifted • [${res.tracks[1].title}](${res.tracks[1].uri})** \`${convertTime(res.tracks[1].duration, true)}\` • ${res.tracks[1].requester}
                            .setDescription(`**Shifted • [${res.tracks[1].title}](${res.tracks[1].uri})** \`${convertTime(res.tracks[1].duration, true)}\` • ${res.tracks[1].requester}`)
                            .setColor(client.color)
    
                        if(msg) await msg.edit({ embeds: [embed], components: [] });
                        if(player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();
                    } else if(id === "three") {
                        await player.queue.unshift(res.tracks[2]);

                        playtop(player);

                        const embed = new EmbedBuilder() //**Shifted • [${res.tracks[2].title}](${res.tracks[2].uri})** \`${convertTime(res.tracks[2].duration, true)}\` • ${res.tracks[2].requester}
                            .setDescription(`**Shifted • [${res.tracks[2].title}](${res.tracks[2].uri})** \`${convertTime(res.tracks[2].duration, true)}\` • ${res.tracks[2].requester}`)
                            .setColor(client.color)
    
                        if(msg) await msg.edit({ embeds: [embed], components: [] });
                        if(player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();
                    } else if(id === "four") {
                        await player.queue.unshift(res.tracks[3]);

                        playtop(player);

                        const embed = new EmbedBuilder() //**Shifted • [${res.tracks[3].title}](${res.tracks[3].uri})** \`${convertTime(res.tracks[3].duration, true)}\` • ${res.tracks[3].requester}
                            .setDescription(`**Shifted • [${res.tracks[3].title}](${res.tracks[3].uri})** \`${convertTime(res.tracks[3].duration, true)}\` • ${res.tracks[3].requester}`)
                            .setColor(client.color)
    
                        if(msg) await msg.edit({ embeds: [embed], components: [] });
                        if(player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();
                    } else if(id === "five") {
                        await player.queue.unshift(res.tracks[4]);

                        playtop(player);

                        const embed = new EmbedBuilder() //**Shifted • [${res.tracks[4].title}](${res.tracks[4].uri})** \`${convertTime(res.tracks[4].duration, true)}\` • ${res.tracks[4].requester}
                            .setDescription(`**Shifted • [${res.tracks[4].title}](${res.tracks[4].uri})** \`${convertTime(res.tracks[4].duration, true)}\` • ${res.tracks[4].requester}`)
                            .setColor(client.color)
    
                        if(msg) await msg.edit({ embeds: [embed], components: [] });
                        if(player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();
                    }
                });

                collector.on('end', async (collected, reason) => {
                    if(reason === "time") {
                        msg.edit({ content: `No interaction!`, embeds: [], components: [] });
                        player.destroy();
                    }
                });

            } else if(res.loadType == "PLAYLIST_LOADED") {
                const queues = player.queue.length;
                await player.queue.add(res.tracks);

                playtoppl(player, queues);

                const playlist = new EmbedBuilder() //**Shifted** • [${res.playlist.name}](${search}) \`${convertTime(res.playlist.duration)}\` (${res.tracks.length} tracks) • ${res.tracks[0].requester}
                    .setDescription(`**Shifted** • [${res.playlist.name}](${search}) \`${convertTime(res.playlist.duration)}\` (${res.tracks.length} tracks) • ${res.tracks[0].requester}`)
                    .setColor(client.color)

                msg.edit({ content: " ", embeds: [playlist] });
                if(!player.playing) player.play()
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