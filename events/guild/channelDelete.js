const { Database } = require("st.db");

const GSetup = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = async (client, channel) => {
    if (channel.type == 2) {
        if (channel.members.has(client.user.id)) {
            const player = client.manager.players.get(channel.guild.id);
            if (player) return player.destroy();
        }
    }

    if (channel.type == 13) {
        if (channel.members.has(client.user.id)) {
            const player = client.manager.players.get(channel.guild.id);
            if (player) return player.destroy();
        }
    }

    if (channel.type == 15) {
        const db = await GSetup.get(`${channel.guild.id}_${client.user.id}`);
        if (db && db.setup_ch == channel.id) {
            const player = client.manager.players.get(channel.guild.id);
            await client.createAlreadySetup(channel); // Can find on handlers/loadDatabase.js
            if (player) return player.destroy();
        }
    }
};