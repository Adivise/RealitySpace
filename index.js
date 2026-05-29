const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { Connectors } = require("shoukaku");
const { Kazagumo, Plugins } = require("kazagumo");

const { TOKEN, PREFIX } = require("./settings/config.js");

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);
process.on('uncaughtExceptionMonitor', console.error);

for (let i = 0; i < TOKEN.length ; i++) {
      const client = new Client({
          shards: "auto",
          intents: [
              GatewayIntentBits.Guilds,
              GatewayIntentBits.GuildMembers,
              GatewayIntentBits.GuildMessages,
              GatewayIntentBits.GuildVoiceStates,
              GatewayIntentBits.MessageContent,
          ],
          allowedMentions: { parse: ["users", "roles"] },
      });

      client.config = require('./settings/config.js');
      client.prefix = PREFIX[i];
      client.token = TOKEN[i];
      
      client.owner = client.config.OWNER_ID;
      client.dev = client.config.DEV_ID;
      client.color = client.config.EMBED_COLOR;

      process.on('unhandledRejection', error => console.log(error));
      process.on('uncaughtException', error => console.log(error));

      client.manager = new Kazagumo({
        defaultSearchPlatform: client.config.DEFAULT_SEARCH,
        plugins: [new Plugins.PlayerMoved(client)],
        send(guildId, payload) {
          const guild = client.guilds.cache.get(guildId);
          if (guild) guild.shard.send(payload);
        },
      }, new Connectors.DiscordJS(client), client.config.NODES);

      ["aliases", "commands"].forEach(x => client[x] = new Collection());
      ["loadCommand", "loadEvent", "loadPlayers", "loadDatabase"].forEach(x => require(`./handlers/${x}`)(client));

      client.login(client.token);
}