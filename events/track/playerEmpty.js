const { EmbedBuilder } = require("discord.js")
const { Database } = require("st.db");

const GSetup = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = async (client, player) => {
    await client.UpdateMusic(player);

    const channel = client.channels.cache.get(player.textId);
    if (!channel) return;

    if (player.data.get("stay")) return;

    const db = await GSetup.get(`${player.guildId}_${client.user.id}`);
    if (db && db.setup_enable === true) return;

    const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription("`📛` | *Song has been:* `Ended`");

    channel.send({ embeds: [embed] });
    return player.destroy();
}