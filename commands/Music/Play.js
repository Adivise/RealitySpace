const { convertTime } = require("../../structures/ConvertTime.js")
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { Database } = require("st.db");

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
        const BotVC = message.guild.members.me.voice.channel;
        if (BotVC && BotVC !== channel) return msg.edit(`I'm not in the same voice channel as you!`);

        if (!channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.Connect)) return msg.edit(`I don't have permission to join your voice channel!`);
        if (!channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.Speak)) return msg.edit(`I don't have permission to speak in your voice channel!`);

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

        if (!args[0]) return msg.edit(`Please provide a song name/link to play music.`);
        const search = args.join(" ");

        const player = await client.manager.createPlayer({
            guildId: message.guild.id,
            voiceId: message.member.voice.channel.id,
            textId: message.channel.id,
            volume: 100,
            deaf: true,
        });

        const res = await client.manager.search(search, { requester: message.author });
        if (!res || !res.tracks.length) return msg.edit(`No results found for ${search}`);

        if (res.type === "PLAYLIST") {
            for (let track of res.tracks) player.queue.add(track);

            if (!player.playing && !player.paused) player.play();

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`**Queued • [${res.playlistName}](${search})** \`${convertTime(res.tracks[0].length + player.queue.durationLength, true)}\` (${res.tracks.length} tracks) • ${res.tracks[0].requester}`)

            return msg.edit({ content: " ", embeds: [embed] })
        } else {
            player.queue.add(res.tracks[0]);

            if (!player.playing && !player.paused) player.play();

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`**Queued • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].length, true)}\` • ${res.tracks[0].requester}`)

            return msg.edit({ content: " ", embeds: [embed] })
        }
    }
}