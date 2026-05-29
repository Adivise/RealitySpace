
const { Database } = require("st.db");

module.exports = async (client) => {
    client.createExSetup = async function (message) {
        const db = new Database("./settings/models/setup.json", { databaseInObject: true });
        const database = await db.has(`${message.guild.id}_${client.user.id}`);
        if (!database) {
            await db.set(`${message.guild.id}_${client.user.id}`, {
                setup_enable: false,
                guild_id: "",
                bot_id: "",
                setup_msg: "",
                setup_ch: "",
                setup_td: ""
            });
        }
    };

    client.createAlreadySetup = async function (message) {
        const db = new Database("./settings/models/setup.json", { databaseInObject: true });
        await db.set(`${message.guild.id}_${client.user.id}`, {
            setup_enable: false,
            guild_id: "",
            bot_id: "",
            setup_msg: "",
            setup_ch: "",
            setup_td: ""
        });
    };

    client.createSetup = async function (message, forum, msg, thread) {
        const db = new Database("./settings/models/setup.json", { databaseInObject: true });
        await db.set(`${message.guild.id}_${client.user.id}`, {
            setup_enable: true,
            guild_id: message.guild.id,
            bot_id: client.user.id,
            setup_msg: msg,
            setup_ch: forum,
            setup_td: thread
        });
    }
};