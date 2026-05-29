const { EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");
const { KazagumoTrack } = require("kazagumo");

const { PREFIX } = require("../../settings/config.js");
const FormatDuration = require("../../structures/FormatDuration.js");
const db = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = async (client) => {
    try {
        client.on("interactionCreate", async (interaction) => {
            if (!interaction.guild || interaction.user.bot) return;

            // Handle filter select menu
            if (interaction.isStringSelectMenu() && interaction.customId === "select_filter") {
                const selected = interaction.values[0];
                const player = client.manager.players.get(interaction.guildId);
                if (!player) {
                    return interaction.reply({ content: 'No music is playing!', flags: 64 });
                }
                if (selected === 'off') {
                    player.shoukaku.setFilters({});
                    player.setVolume(50);
                    return interaction.reply({ content: 'Filters turned off!', flags: 64 });
                } else if (selected === 'earrape') {
                    player.shoukaku.setFilters({});
                    player.setVolume(1000)
                    return interaction.reply({ content: `Applied filter: **earrape**`, flags: 64 });
                } else {
                    player.setVolume(50);
                    player.shoukaku.setFilters(selected);
                    return interaction.reply({ content: `Applied filter: **${selected}**`, flags: 64 });
                }
            }

            if (!interaction.isButton()) return;

            const { customId, member } = interaction;
            const voiceMember = interaction.guild.members.cache.get(member.id);
            const channel = voiceMember.voice.channel;
            const player = client.manager.players.get(interaction.guildId);
            if (!player) return;
            const data = await db.get(`${interaction.guild.id}_${client.user.id}`);
            if (!data || data.setup_enable === false) return;

            // Helper for quick reply
            async function quickReply(contentOrEmbed) {
                if (typeof contentOrEmbed === 'string') {
                    await interaction.reply({ content: contentOrEmbed, flags: 64 });
                } else {
                    await interaction.reply({ ...contentOrEmbed, flags: 64 });
                }
            }

            switch (customId) {
                case "sprevious": {
                    if (!channel || (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel))) {
                        return quickReply("You need to be in a voice channel.");
                    }
                    if (!player) return quickReply("There is nothing in the queue right now!");
                    if (player.queue.previous) {
                        return quickReply("`🚨` | **There are no** `Previous` **songs**");
                    }
                    await player.play(new KazagumoTrack(player.queue.previous.getRaw(), interaction.user));
                    return quickReply({ embeds: [new EmbedBuilder().setDescription("`⏮` | **Song has been:** `Previous`").setColor(client.color)] });
                }
                case "sskip": {
                    if (!channel || (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel))) {
                        return quickReply("You need to be in a voice channel.");
                    }
                    if (!player) return quickReply("There is nothing in the queue right now!");
                    if (player.songs.length === 1 && player.data.get("autoplay") === false) {
                        return quickReply({ embeds: [new EmbedBuilder().setColor(client.color).setDescription("`🚨` | **There are no** `Songs` **in queue**")] });
                    }
                    await player.skip();
                    return quickReply({ embeds: [new EmbedBuilder().setColor(client.color).setDescription("`⏭` | **Song has been:** `Skipped`")] });
                }
                case "sstop": {
                    if (!channel || (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel))) {
                        return quickReply("You need to be in a voice channel.");
                    }
                    if (!player) return quickReply("There is nothing in the queue right now!");
                    await client.UpdateMusic(player);
                    await player.destroy();
                    const memberVoice = interaction.member.voice.channel;
                    return quickReply({ embeds: [new EmbedBuilder().setDescription(`\`🚫\` | **Left:** | \`${memberVoice.name}\``).setColor('#000001')] });
                }
                case "spause": {
                    if (!channel || (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel))) {
                        return quickReply("You need to be in a voice channel.");
                    }
                    if (!player) return quickReply("There is nothing in the queue right now!");
                    if (player.paused) {
                        await player.pause(false);
                        return quickReply({ embeds: [new EmbedBuilder().setColor(client.color).setDescription("`⏯` | **Song has been:** `Resumed`")] });
                    } else {
                        await player.pause(true);
                        return quickReply({ embeds: [new EmbedBuilder().setColor(client.color).setDescription("`⏯` | **Song has been:** `Paused`")] });
                    }
                }
                case "sloop": {
                    if (!channel || (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel))) {
                        return quickReply("You need to be in a voice channel.");
                    }
                    if (!player) return quickReply("There is nothing in the queue right now!");
                    if (player.loop === "queue") {
                        await player.setLoop("none");
                        return quickReply({ embeds: [new EmbedBuilder().setColor(client.color).setDescription("`🔁` | **Song is unloop:** `All`")] });
                    } else {
                        await player.setLoop("queue");
                        return quickReply({ embeds: [new EmbedBuilder().setColor(client.color).setDescription("`🔁` | **Song is loop:** `All`")] });
                    }
                }
                case "sshuffle": {
                    if (!channel || (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel))) {
                        return quickReply("You need to be in a voice channel.");
                    }
                    if (!player) return quickReply("There is nothing in the queue right now!");
                    await player.queue.shuffle();
                    return quickReply({ embeds: [new EmbedBuilder().setColor(client.color).setDescription("`🔀` | **Song has been:** `Shuffle`")] });
                }
                case "svoldown": {
                    if (!channel || (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel))) {
                        return quickReply("You need to be in a voice channel.");
                    }
                    if (!player) return quickReply("There is nothing in the queue right now!");
                    await player.setVolume(player.volume - 10);
                    return quickReply({ embeds: [new EmbedBuilder().setColor(client.color).setDescription(`\`🔊\` | **Decrease volume to:** \`${player.volume}\`%`)] });
                }
                case "sclear": {
                    if (!channel || (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel))) {
                        return quickReply("You need to be in a voice channel.");
                    }
                    if (!player) return quickReply("There is nothing in the queue right now!");
                    await player.queue.clear();
                    return quickReply({ embeds: [new EmbedBuilder().setDescription("`📛` | **Queue has been:** `Cleared`").setColor(client.color)] });
                }
                case "svolup": {
                    if (!channel || (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel))) {
                        return quickReply("You need to be in a voice channel.");
                    }
                    if (!player) return quickReply("There is nothing in the queue right now!");
                    await player.setVolume(player.volume + 10);
                    return quickReply({ embeds: [new EmbedBuilder().setColor(client.color).setDescription(`\`🔊\` | **Increase volume to:** \`${player.volume}\`%`)] });
                }
                case "squeue": {
                    if (!channel || (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel))) {
                        return quickReply("You need to be in a voice channel.");
                    }
                    if (!player) return quickReply("There is nothing in the queue right now!");

                    const song = player.queue.current;
                    const qduration = FormatDuration(player.queue.durationLength + song.length);
                    const thumbnail = `https://img.youtube.com/vi/${song.identifier}/hqdefault.jpg`;

                    const pagesNum = Math.ceil(player.queue.length / 10) || 1;
                    const songStrings = [];
                    for (let i = 1; i < player.queue.length; i++) {
                        const song = player.queue[i];
                        songStrings.push(`**${i}.** [${song.title}](${song.uri}) \`[${FormatDuration(song.length)}]\` • ${song.requester}\n`);
                    }
                    const pages = [];
                    for (let i = 0; i < pagesNum; i++) {
                        const str = songStrings.slice(i * 10, i * 10 + 10).join('');
                        const embed = new EmbedBuilder()
                            .setAuthor({ name: `Queue - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                            .setThumbnail(thumbnail)
                            .setColor(client.color)
                            .setDescription(`**Currently Playing:**\n**[${song.title}](${song.uri})** \`[${FormatDuration(song.length)}]\` • ${song.requester}\n\n**Rest of queue**${str == '' ? '  Nothing' : '\n' + str}`)
                            .setFooter({ text: `Page • ${i + 1}/${pagesNum} | ${player.queue.length} • Songs | ${qduration} • Total duration` });
                        pages.push(embed);
                    }
                    quickReply({ embeds: [pages[0]] });
                    break;
                }
                default:
                    break;
            }
        });
    } catch (e) {
        console.log(e);
    }

    // Text handler (unchanged, but cleaned up formatting)
    client.on("messageCreate", async (message) => {
        if (!message.guild || !message.guild.available) return;

        await client.createExSetup(message);

        const data = await db.get(`${message.guild.id}_${client.user.id}`);
        if (!data || data.setup_enable === false) return;

        const forum = await client.channels.cache.get(message.channel.id);
        if (!forum) return;
        if (forum.id != data.setup_td) return;

        if (message.author.id === client.user.id && message.id !== data.setup_msg) {
            setTimeout(async () => {
                try { await message.delete(); } catch (err) { if (err.code !== 10008) console.error(err); }
            }, 8000);
            return;
        }

        if (message.author.bot) return;

        const song = message.cleanContent;
        try { await message.delete(); } catch (err) { if (err.code !== 10008) console.error(err); }
        if (message.mentions.users.size > 0) return;
        if (PREFIX.some(p => song.startsWith(p))) return message.channel.send(`Prefix commands is disable because setup music is enabled.`);

        const voiceChannel = await message.member.voice.channel;
        if (!voiceChannel) return message.channel.send(`You need to be in a voice channel.`);

        const list = await message.member.guild.channels.fetch(voiceChannel.id);
        const members = list.members.map(m => m);
        const bot = members.filter(m => m.user.bot === true).map(m => m.user.id);

        const controlDB = new Database('./settings/models/control.json', { databaseInObject: true });
        const botBypass = await controlDB.get(`${message.guild.id}_botbypass`);
        const isOwner = message.author.id === client.owner;
        if (!botBypass && !isOwner) {
            if (!bot.includes(client.user.id) && bot.length >= 1) {
                return message.channel.send(`You can't use 2 bot in 1 voice channel!`);
            }
        }

        const player = await client.manager.createPlayer({
            guildId: message.guild.id,
            voiceId: message.member.voice.channel.id,
            textId: message.channel.id,
            volume: 100,
            deaf: true,
        });

        const res = await client.manager.search(song, { requester: message.author });
        if (!res || !res.tracks.length) return message.channel.send(`No results found for ${song}`);

        if (res.type === "PLAYLIST") {
            for (let track of res.tracks) player.queue.add(track);
            if (!player.playing && !player.paused) player.play();
        } else {
            player.queue.add(res.tracks[0]);
            if (!player.playing && !player.paused) player.play();
        }
    });
};