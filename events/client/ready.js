const { Client } = require("discord.js");

/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {
    await client.manager.init(client.user.id);
    console.log(`[INFO] - ${client.user.username} (${client.user.id}) is Ready!`);

    const activity = {
        name: `${client.prefix}play <songs>`,
        type: 5,
    };

    client.user.setPresence({ 
        activities: [activity], 
        status: 'dnd', 
        afk: true,
    });
};
