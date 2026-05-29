const { EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");
const FormatDuration = require("../../structures/FormatDuration");

const db = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = async (client) => {

    client.UpdateQueueMsg = async function (player) {
        try {
            const data = await db.get(`${player.guildId}_${client.user.id}`);
            if (!data || data.setup_enable === false) { return; }

            // Fetch the setup thread using setup_td
            if (!data.setup_td) return;
            const thread = client.channels.cache.get(data.setup_td) || await client.channels.fetch(data.setup_td).catch(() => undefined);
            if (!thread || !thread.isThread()) return;
            // Fetch the parent forum
            const forumChannel = client.channels.cache.get(thread.parentId) || await client.channels.fetch(thread.parentId).catch(() => undefined);
            if (!forumChannel || forumChannel.type !== 15) return;

            const forum = await forumChannel.fetch();
            if (!forum) { return; }

            if (!data.setup_msg) return;
            const playMsg = await thread.messages.fetch(data.setup_msg, { cache: false, force: true }).catch(() => undefined);
            if (!playMsg) { return; }

            // Add null checks for queue and songs
            if (!player || !player.queue || !Array.isArray(player.queue)) {
                console.log('[UpdateQueueMsg] Queue or songs array is invalid');
                return;
            }

            let upNextArr = player.queue.slice(1).map((song, i) => {
                // Add null checks for song properties
                if (!song) {
                    console.log(`[UpdateQueueMsg] Song at index ${i + 1} is null/undefined`);
                    return `➡️ **${i + 1}.** *\`Unknown Song - [Unknown Duration]\`* • Unknown User`;
                }
                
                const songName = song.title || 'Unknown Song';
                const songDuration = song.length ? FormatDuration(song.length) : 'Unknown Duration';
                const userName = song.requester?.tag || song.requester?.username || 'Unknown User';
                
                return `➡️ **${i + 1}.** *\`${songName} - [${songDuration}]\`* • ${userName}`;
            });
            
            let upNext = upNextArr.slice(0, 10).join('\n');
            if (upNextArr.length > 10) {
                upNext += `\n\`...and other songs in queue.\``;
            }
            // If no up next songs, show single line
            let upNextContent = upNextArr.length === 0
                ? '**__Up Next:__** `No more songs in queue.`'
                : `**__Up Next:__**\n${upNext}`;

            const cSong = player.queue.current;
            if (!cSong) {
                console.log('[UpdateQueueMsg] Current song is null/undefined');
                return;
            }
            
            const played = player.playing ? `Playing song...` : `Song pause...`;
            const songName = cSong.title || 'Unknown Song';
            const songUrl = cSong.uri || '#';
            const songDuration = cSong.length ? FormatDuration(cSong.length) : 'Unknown Duration';
            const userName = cSong.requester?.tag || cSong.requester?.username || 'Unknown User';
            const songId = cSong.identifier || 'unknown';
            const qduration = FormatDuration(player.queue.durationLength + cSong.length);
            
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${played}`, iconURL: "https://cdn.discordapp.com/emojis/741605543046807626.gif" })
                .setDescription(`[${songName}](${songUrl}) \`[${songDuration}]\` • ${userName}`)
                .setColor(client.color)
                .setImage(`https://img.youtube.com/vi/${songId}/sddefault.jpg`)
                .setFooter({ text: `📃 • ${player.queue.length} | 🔊 • ${player.volume}% | ⌚ • ${qduration}` });

            try {
                const playingTag = forum.availableTags?.find(tag => tag.name == 'Playing');
                if (playingTag) await thread.setAppliedTags([playingTag.id]);
            } catch (e) {
                console.log('[UpdateQueueMsg] Error setting playing tag:', e.message);
            }

            return playMsg.edit({ 
                content: upNextContent,
                embeds: [embed],
                components: [client.filterMenuRow, client.enSwitch, client.enSwitch2] 
            }).catch((e) => {
                console.log('[UpdateQueueMsg] Error editing message:', e.message);
            });
        } catch (error) {
            console.log('[UpdateQueueMsg] Unexpected error:', error.message);
        }
    };

    client.UpdateMusic = async function (player) {
        try {
            const data = await db.get(`${player.guildId}_${client.user.id}`);
            if (!data || data.setup_enable === false) { return; }

            // Fetch the setup thread using setup_td
            if (!data.setup_td) return;
            const thread = client.channels.cache.get(data.setup_td) || await client.channels.fetch(data.setup_td).catch(() => undefined);
            if (!thread || !thread.isThread()) return;
            // Fetch the parent forum
            const forumChannel = client.channels.cache.get(thread.parentId) || await client.channels.fetch(thread.parentId).catch(() => undefined);
            if (!forumChannel || forumChannel.type !== 15) return;

            const forum = await forumChannel.fetch();
            if (!forum) { return; }

            if (!data.setup_msg) return;
            const playMsg = await thread.messages.fetch(data.setup_msg, { cache: false, force: true }).catch(() => undefined);
            if (!playMsg) { return; }

            const queueMsg = `**__Up Next:__** \`No more songs in queue.\`\nJoin a voice channel and queue songs by name or url in here.`;
            const playEmbed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: `No song playing currently.` })
                .setImage(`https://media.discordapp.net/attachments/848185400937807882/1395454344832483490/file_0000000059e461f889bc44d78a738c22.png`)
                .setDescription(`>>> [Invite](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot) | [Support](https://discord.gg/SNG3dh3MbR) | [Website](https://adivise.github.io/Stylish/)`)
                .setFooter({ text: `Prefix is: ${client.prefix}` });

            try {
                const freeTag = forum.availableTags?.find(tag => tag.name == 'Free');
                if (freeTag) await thread.setAppliedTags([freeTag.id]);
            } catch (e) {
                console.log('[UpdateMusic] Error setting free tag:', e.message);
            }

            return playMsg.edit({ 
                content: `${queueMsg}`, 
                embeds: [playEmbed], 
                components: [client.diSwitch, client.diSwitch2] 
            }).catch((e) => {
                console.log('[UpdateMusic] Error editing message:', e.message);
            });
        } catch (error) {
            console.log('[UpdateMusic] Unexpected error:', error.message);
        }
    };
};