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

		const player = client.manager.players.get(message.guild.id);
		if (!player) return msg.edit(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return msg.edit(`I'm not in the same voice channel as you!`);

        if (!args[0]) return msg.edit(`Please provide a song name/link to play music.`);
        const search = args.join(" ");
        
        const res = await client.manager.search(search, { requester: message.author });
        if (!res || !res.tracks.length) return msg.edit(`No results found for ${search}`);

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
        
        if (res.type === "PLAYLIST") {
            const queues = player.queue.size;
            for (let track of res.tracks) player.queue.add(track);
            
            Playlist(player, queues);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`**Shifted • [${res.playlistName}](${args})** \`${convertTime(player.queue.durationLength, true)}\` (${res.tracks.length} tracks) • ${res.tracks[0].requester}`)

            return msg.edit({ embeds: [embed] })
        } else {
            let index = 1;
            const results = res.tracks.slice(0, 5).map(x => `**(${index++}.) [${x.title}](${x.uri})** \`${convertTime(x.length, true)}\` Author: ${x.author}`).join("\n")

            const embed = new EmbedBuilder()
                .setAuthor({ name: `Song Selection...`, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setColor(client.color)
                .setDescription(results)
                .setFooter({ text: `Please Respone in 30s` })
            await msg.edit({ embeds: [embed], components: [row], content: " " });

            const collector = msg.createMessageComponentCollector({ filter: (interaction) => interaction.user.id === message.author.id, max: 1, time: 30000 });

            collector.on('collect', async (interaction) => {
                if(!interaction.deferred) await interaction.deferUpdate();
                if(!player && !collector.ended) return collector.stop();
                const id = interaction.customId;

                if(id === "one") {
                    player.queue.add(res.tracks[0]);
                    Normal(player);

                    const embed = new EmbedBuilder()
                        .setDescription(`**Shifted • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].length, true)}\` • ${res.tracks[0].requester}`)
                        .setColor(client.color)
 
                    if(msg) msg.edit({ embeds: [embed], components: [] });
                } else if(id === "two") {
                    player.queue.add(res.tracks[1]);
                    Normal(player);

                    const embed = new EmbedBuilder()
                        .setDescription(`**Shifted • [${res.tracks[1].title}](${res.tracks[1].uri})** \`${convertTime(res.tracks[1].length, true)}\` • ${res.tracks[1].requester}`)
                        .setColor(client.color)

                    if(msg) msg.edit({ embeds: [embed], components: [] });
                } else if(id === "three") {
                    player.queue.add(res.tracks[2]);
                    Normal(player);

                    const embed = new EmbedBuilder()
                        .setDescription(`**Shifted • [${res.tracks[2].title}](${res.tracks[2].uri})** \`${convertTime(res.tracks[2].length, true)}\` • ${res.tracks[2].requester}`)
                        .setColor(client.color)

                    if(msg) msg.edit({ embeds: [embed], components: [] });
                } else if(id === "four") {
                    player.queue.add(res.tracks[3]);
                    Normal(player);

                    const embed = new EmbedBuilder()
                        .setDescription(`**Shifted • [${res.tracks[3].title}](${res.tracks[3].uri})** \`${convertTime(res.tracks[3].length, true)}\` • ${res.tracks[3].requester}`)
                        .setColor(client.color)

                    if(msg) msg.edit({ embeds: [embed], components: [] });
                } else if(id === "five") {
                    player.queue.add(res.tracks[4]);
                    Normal(player);

                    const embed = new EmbedBuilder()
                        .setDescription(`**Shifted • [${res.tracks[4].title}](${res.tracks[4].uri})** \`${convertTime(res.tracks[4].length, true)}\` • ${res.tracks[4].requester}`)
                        .setColor(client.color)

                    if(msg) msg.edit({ embeds: [embed], components: [] });
                }
            });

            collector.on('end', async (collected, reason) => {
                if(reason === "time") {
                    await msg.edit({ content: `No Interaction!`, embeds: [], components: [] });
                    if (!player.playing) player.destroy();
                }
            });
        }
        }
    }

function Normal(player) {
    const song = player.queue[player.queue.size - 1];
    player.queue.splice(player.queue.size - 1, 1);
    player.queue.splice(0, 0, song);
}

function Playlist(player, queues) {
    let num = 0;
    for (let i = queues; i < player.queue.size; i++) {
        const song = player.queue[i];
        player.queue.splice(i, 1);
        player.queue.splice(num++, 0, song);
    }
}