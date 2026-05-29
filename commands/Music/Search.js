const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField, ButtonStyle } = require("discord.js");
const { convertTime } = require("../../structures/ConvertTime.js");
const { Database } = require("st.db");

module.exports = {
    config: {
        name: "search",
        description: "Search a song!",
        usage: "<result>",
        category: "Music",
        accessableby: "Member",
    },
    run: async (client, message, args) => {
        const msg = await message.channel.send(`Loading please wait....`);

        const { channel } = message.member.voice;
        if (!channel) return msg.edit(`You are not in a voice channel!`);
        const BotVC = message.guild.members.me.voice.channel;
        if (BotVC && BotVC !== channel) return msg.edit(`I'm not in the same voice channel as you!`);

        if (!channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.Connect)) return msg.edit(`I do not have permission to join your voice channel!`);
        if (!channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.Speak)) return msg.edit(`I do not have permission to speak in your voice channel!`);

        // list channel who in voice channel
        const list = await message.member.guild.channels.fetch(channel.id);
        const members = list.members.map(m => m);
        const bot = members.filter(m => m.user.bot === true).map(m => m.user.id);
        // Can't have 2 bot in 1 voice channel
        const controlDB = new Database('./settings/models/control.json', { databaseInObject: true });
        const botBypass = await controlDB.get(`${message.guild.id}_botbypass`);
        const isOwner = message.author.id === client.owner;
        if (!botBypass && !isOwner) {
            if (!bot.includes(client.user.id) && bot.length >= 1) {
                return msg.edit(`You can't use 2 bot in 1 voice channel!`);
            }
        }
        if (!args[0]) return msg.edit(`Please provide a song name to search music.`);

        const player = await client.manager.createPlayer({
            guildId: message.guild.id,
            textId: message.channel.id,
            voiceId: channel.id,
            volume: 100,
            deaf: true
        });

        const row = new ActionRowBuilder()
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

        const search = args.join(" ");
        const res = await client.manager.search(search, { requester: message.author });
        if (!res || !res.tracks.length) return msg.edit(`No results found for ${search}`);

        if (res.type === "PLAYLIST") {
            for (let track of res.tracks) player.queue.add(track);

            if (!player.playing && !player.paused) player.play();

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`**Queued • [${res.playlistName}](${args})** \`${convertTime(player.queue.durationLength, true)}\` (${res.tracks.length} tracks) • ${res.tracks[0].requester}`)

            return msg.edit({ embeds: [embed] })
        } else {
            let index = 1;
            const results = res.tracks
                .slice(0, 5)
                .map(x => `**(${index++}.) [${x.title}](${x.uri})** \`${convertTime(x.length, true)}\` Author: \`${x.author}\``)
                .join("\n");
            const embed = new EmbedBuilder()
                .setAuthor({ name: `Song Selection...`, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setColor(client.color)
                .setDescription(results)
                .setFooter({ text: `Please Respone in 30s` })
            await msg.edit({ content: " ", embeds: [embed], components: [row] });

            const collector = msg.createMessageComponentCollector({ filter: (interaction) => interaction.user.id === message.author.id ? true : false && interaction.deferUpdate(), max: 1, time: 30000 });

            collector.on('collect', async (interaction) => {
                if (!interaction.deferred) await interaction.deferUpdate();
                if (!player && !collector.ended) return collector.stop();
                const id = interaction.customId;

                if (id === "one") {
                    player.queue.add(res.tracks[0]);

                    const embed = new EmbedBuilder()
                        .setDescription(`**Queued • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].length, true)}\` • ${res.tracks[0].requester}`)
                        .setColor(client.color)

                    if (msg) await msg.edit({ embeds: [embed], components: [] });
                } else if (id === "two") {
                    player.queue.add(res.tracks[1]);

                    const embed = new EmbedBuilder()
                        .setDescription(`**Queued • [${res.tracks[1].title}](${res.tracks[1].uri})** \`${convertTime(res.tracks[1].length, true)}\` • ${res.tracks[1].requester}`)
                        .setColor(client.color)

                    if (msg) await msg.edit({ embeds: [embed], components: [] });
                } else if (id === "three") {
                    player.queue.add(res.tracks[2]);

                    const embed = new EmbedBuilder()
                        .setDescription(`**Queued • [${res.tracks[2].title}](${res.tracks[2].uri})** \`${convertTime(res.tracks[2].length, true)}\` • ${res.tracks[2].requester}`)
                        .setColor(client.color)

                    if (msg) await msg.edit({ embeds: [embed], components: [] });
                } else if (id === "four") {
                    player.queue.add(res.tracks[3]);

                    const embed = new EmbedBuilder()
                        .setDescription(`**Queued • [${res.tracks[3].title}](${res.tracks[3].uri})** \`${convertTime(res.tracks[3].length, true)}\` • ${res.tracks[3].requester}`)
                        .setColor(client.color)

                    if (msg) await msg.edit({ embeds: [embed], components: [] });
                } else if (id === "five") {
                    player.queue.add(res.tracks[4]);

                    const embed = new EmbedBuilder()
                        .setDescription(`**Queued • [${res.tracks[4].title}](${res.tracks[4].uri})** \`${convertTime(res.tracks[4].length, true)}\` • ${res.tracks[4].requester}`)
                        .setColor(client.color)

                    if (msg) await msg.edit({ embeds: [embed], components: [] });
                }
            });

            collector.on('end', async (collected, reason) => {
                if (reason === "time") {
                    msg.edit({ content: `No interaction!`, embeds: [], components: [] });
                    if (!player.playing) player.destroy();
                }
            });
        }
    }
}

