
const { Database } = require("st.db");

module.exports = async (client) => {
    client.createControl = async function (message) {
        const db = new Database("./settings/models/control.json", { databaseInObject: true });
        const database = await db.has(message.guild.id);
        if (!database) {
            await db.set({ key: message.guild.id, value: true });
        }
    };
};