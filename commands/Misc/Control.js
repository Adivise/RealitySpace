const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { Database } = require("st.db");

module.exports = {
    config: {
        name: "control",
        aliases: ["setcontrol"],
        category: "Misc",
        description: "Toggle the bot playing message.",
        accessableby: "Members"
    },
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.channel.send(`You don't have permission to use this command!`);

        const db = new Database(`./settings/models/control.json`, { databaseInObject: true });
        const msg = await message.channel.send(`Loading please wait....`);

        const database = await db.get(message.guild.id);
        // check == true == false
        if (database === true) {
            db.set(message.guild.id, false);

            const off = new EmbedBuilder()
                .setDescription("`🌙` | *Control has been:* `Deactivated`")
                .setColor(client.color);

            msg.edit({ content: " ", embeds: [off] });
        } else {
            db.set(message.guild.id, true);

            const on = new EmbedBuilder()
                .setDescription("`🌕` | *Control has been:* `Activated`")
                .setColor(client.color);

            msg.edit({ content: " ", embeds: [on] });
        }
    }
}