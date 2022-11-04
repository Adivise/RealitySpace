const { EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");

module.exports = {
    config: {
        name: "whitelist",
        usage: "[add/remove] <guildID>",
        category: "Dev",
        description: "Whitelists a guild.",
        accessableby: "Owners"
    },
    ownerOnly: true,
    run: async (client, message, args) => {
        const db = new Database(`./settings/models/access.json`, { databaseInObject: true });
        
        if (args[0] === "add") {
            const guild = client.guilds.cache.get(args[1]);
            if (!guild) return message.channel.send(`Please enter a valid guild id! (ฺBot not in server)`);
            
            const database = db.get(`whitelist`);
            if (database.includes(args[1])) return message.channel.send(`This guild is already whitelisted!`);
    
            db.push({ key: "whitelist", value: args[1] });
    
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`**Add • ${guild.name} (${guild.id})** to whitelist`);
    
            message.channel.send({ embeds: [embed] });
        } else if (args[0] === "remove") {
            const guild = client.guilds.cache.get(args[1]);
            if (!guild) return message.channel.send(`Please enter a valid guild id! (ฺBot not in server)`);
            
            const database = db.get(`whitelist`);
            if (!database.includes(args[1])) return message.channel.send(`This guild is not whitelist!`);
    
            db.pull({ key: "whitelist", value: args[1] });
    
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`**Remove • ${guild.name} (${guild.id}) from whitelist**`);
    
            message.channel.send({ embeds: [embed] });
        } else {
            return message.channel.send(`Please enter a valid option! ${client.prefix}whitelist [add/remove] <guildID>`);
        }
    }
}