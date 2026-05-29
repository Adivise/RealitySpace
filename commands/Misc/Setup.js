const { Client, EmbedBuilder, AttachmentBuilder, PermissionsBitField, GatewayIntentBits } = require("discord.js");
const { Database } = require("st.db");

const GSetup = new Database("./settings/models/setup.json", { databaseInObject: true });
const { TOKEN, PREFIX, TOTAL_BOTS } = require("../../settings/config.js");

module.exports = {
    config: {
        name: "setup",
        aliases: [],
        usage: "(forum id)",
        category: "Misc",
        description: "Create a song sender channel",
        accessableby: "Members"
    },
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.channel.send(`You don't have permission.`);

        const string = args[0]
        if (!string) return message.channel.send("Please give me **Forum Channel ID**")

        const channel = await client.channels.cache.get(string);

        if (channel.type != 15) return message.channel.send("Please use **Forum Channel**.")

        // Permission check before proceeding
        const requiredPerms = [
            'ViewChannel',
            'SendMessages',
            'SendMessagesInThreads',
            'CreatePublicThreads',
            'CreatePrivateThreads',
            'ManageThreads'
        ];
        const botMember = await message.guild.members.fetch(client.user.id);
        const missingPerms = requiredPerms.filter(perm => !channel.permissionsFor(botMember).has(perm));
        if (missingPerms.length > 0) {
            return message.channel.send(`I am missing the following permissions in <#${channel.id}>: ${missingPerms.map(p => ` ${p}`).join(', ')}`);
        }

        // Ensure tags 'Playing' and 'Free' exist
        let tags = channel.availableTags || [];
        let playingTag = tags.find(tag => tag.name === 'Playing');
        let freeTag = tags.find(tag => tag.name === 'Free');
        const tagsToCreate = [];
        if (!playingTag) tagsToCreate.push({
            name: 'Playing',
            moderated: false,
        });
        if (!freeTag) tagsToCreate.push({
            name: 'Free',
            moderated: false,
        });
        if (tagsToCreate.length > 0) {
            try {
                await channel.setAvailableTags([
                    ...tags,
                    ...tagsToCreate
                ]);
                // Refresh tags after creation
                tags = channel.availableTags = await channel.fetch().then(c => c.availableTags);
                playingTag = tags.find(tag => tag.name === 'Playing');
                freeTag = tags.find(tag => tag.name === 'Free');
            } catch (e) {
                // ignore errors (e.g. missing permissions)
            }
        }

        let successCount = 0;
        let failCount = 0;
        const failedBots = [];

        for (let i = 0; i < TOTAL_BOTS; i++) {
            const bot = new Client({
                intents: [
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.GuildMembers,
                    GatewayIntentBits.GuildMessages,
                    GatewayIntentBits.GuildVoiceStates,
                    GatewayIntentBits.MessageContent,
                ],
            });

            bot.createExSetup = async function (message, forum, msg, thread) {
                const db = new Database("./settings/models/setup.json", { databaseInObject: true });
                await db.set(`${message.guild.id}_${bot.user.id}`, {
                    setup_enable: true,
                    guild_id: message.guild.id,
                    bot_id: bot.user.id,
                    setup_msg: msg,
                    setup_ch: forum,
                    setup_td: thread
                });
            }

            bot.prefix = PREFIX[i];
            if (!bot.token) bot.token = TOKEN[i];

            bot.on("ready", async (msg) => {
                try {
                    console.log(`[SETUP] Bot ${i + 1}/${TOTAL_BOTS} (${bot.user.tag}) is ready`);

                    // auto create request channel!!!!
                    const forum = bot.channels.cache.get(string);
                    if (!forum) {
                        console.log(`[SETUP] Bot ${i + 1} - Forum not found in cache`);
                        failedBots.push(`Bot ${i + 1} (${bot.user.tag}) - Forum not accessible`);
                        failCount++;
                        bot.destroy();
                        return;
                    }

                    const guild = bot.guilds.cache.get(forum.guild.id)
                    if (!guild) {
                        console.log(`[SETUP] Bot ${i + 1} - Guild not found in cache`);
                        failedBots.push(`Bot ${i + 1} (${bot.user.tag}) - Guild not accessible`);
                        failCount++;
                        bot.destroy();
                        return;
                    }

                    const db = await GSetup.get(`${guild.id}_${bot.user.id}`);
                    if (db && db.setup_enable === true) {
                        console.log(`[SETUP] Bot ${i + 1} - Already has setup enabled`);
                        successCount++;
                        bot.destroy();
                        return;
                    }

                    const attachment = new AttachmentBuilder("./settings/images/banner.png", { name: "setup.png" });

                    await forum.threads.create({
                        name: `${bot.user.username}`,
                        message: {
                            content: `\`My prefix is: ${bot.prefix}\``,
                            files: [attachment],
                        },
                        appliedTags: freeTag ? [freeTag.id] : []
                    }).then(async (thread) => {

                        const content = `**__Up Next:__** \`No more songs in queue.\`\nJoin a voice channel and queue songs by name or url in here.`;

                        const embed = new EmbedBuilder()
                            .setColor(client.color)
                            .setAuthor({ name: `No song playing currently.` })
                            .setImage(`https://media.discordapp.net/attachments/848185400937807882/1395454344832483490/file_0000000059e461f889bc44d78a738c22.png`)
                            .setDescription(`>>> [Invite](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot) | [Support](https://discord.gg/SNG3dh3MbR) | [Website](https://adivise.github.io/Stylish/)`)
                            .setFooter({ text: `Prefix is: ${bot.prefix}` });

                        await thread.send({ content: `${content}`, embeds: [embed], components: [client.diSwitch, client.diSwitch2] }).then(async (message) => {
                            // Create database!
                            await bot.createExSetup(message, forum.id, message.id, thread.id); // Can find on handlers/loadDatabase.js
                            console.log(`[SETUP] Bot ${i + 1} (${bot.user.tag}) - Forum created successfully`);
                            successCount++;
                            bot.destroy();
                        }).catch(async (error) => {
                            console.log(`[SETUP] Bot ${i + 1} - Failed to send message: ${error.message}`);
                            failedBots.push(`Bot ${i + 1} (${bot.user.tag}) - Message send failed`);
                            failCount++;
                            bot.destroy();
                        });
                    }).catch(async (error) => {
                        console.log(`[SETUP] Bot ${i + 1} - Failed to create thread: ${error.message}`);
                        failedBots.push(`Bot ${i + 1} (${bot.user.tag}) - Thread creation failed`);
                        failCount++;
                        bot.destroy();
                    });
                } catch (error) {
                    console.log(`[SETUP] Bot ${i + 1} - Error in ready event: ${error.message}`);
                    failedBots.push(`Bot ${i + 1} (${bot.user.tag}) - Ready event error`);
                    failCount++;
                    bot.destroy();
                }
            });

            bot.on("error", (error) => {
                console.log(`[SETUP] Bot ${i + 1} - Login error: ${error.message}`);
                failedBots.push(`Bot ${i + 1} - Login failed`);
                failCount++;
            });

            bot.login(bot.token).catch((error) => {
                console.log(`[SETUP] Bot ${i + 1} - Login failed: ${error.message}`);
                failedBots.push(`Bot ${i + 1} - Login failed`);
                failCount++;
            });
        }

        // Wait a bit for bots to process, then send status
        setTimeout(() => {
            const embed = new EmbedBuilder()
                .setDescription(`✅ **Creating Music System Successfully.**\n\n**Status:**\n• Successfully created: **${successCount}** forums\n• Failed: **${failCount}** bots\n• Total bots: **${TOTAL_BOTS}**\n\n${failedBots.length > 0 ? `**Failed bots:**\n${failedBots.slice(0, 10).join('\n')}${failedBots.length > 10 ? `\n... and ${failedBots.length - 10} more` : ''}` : ''}\n\n\`Note: All commands are disabled.\``)

            return message.channel.send({ embeds: [embed] });
        }, 5000); // Wait 5 seconds for bots to process
    }
}
