const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");

const GSetup = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = async (client, message) => {
  if (message.author.bot || message.channel.type === 1) return;

  await client.createExSetup(message);

  if (message.content.startsWith('!play')) {
    if (message.author.id != client.owner) return;
    const parts = message.content.split(" ");
    const song = parts[1];
    if (!song) return;

    const player = await client.manager.createPlayer({
      guildId: message.guild.id,
      textId: message.channel.id,
      voiceId: message.member.voice.channel.id,
      volume: 100,
      deaf: true
    });

    player.play(song, { requester: message.author });

  } else if (message.content.startsWith('!stop') || message.content.startsWith('!leave')) {
    if (message.author.id != client.owner) return;

    const player = client.manager.players.get(message.guild.id);
    if (!player) return;
    player.destroy();
  } else if (message.content.startsWith('!volume')) {
    if (message.author.id != client.owner) return;

    const parts = message.content.split(" ");
    const amount = parts[1];

    const player = client.manager.players.get(message.guild.id);
    if (!player) return;
    player.setVolume(Number(amount));

  } else if (message.content.startsWith('!join')) {
    if (message.author.id != client.owner) return;
    try {
      const player = client.manager.createPlayer({
        guildId: message.guild.id,
        textId: message.channel.id,
        voiceId: message.member.voice.channel.id,
        volume: 100,
        deaf: true
      });
      if (!player) return;
    } catch {
      //
    }
  } else if (message.content.startsWith('!replay')) {
    if (message.author.id != client.owner) return;
    try {
      const player = client.manager.players.get(message.guild.id);
      if (!player) return;
      await player.seek(0);
    } catch {
      //
    }
  } else if (message.content.startsWith('!loop')) {
    const player = client.manager.players.get(message.guild.id);
    if (!player) return;
    if (player.loop === "queue") {
      player.setLoop("none");
    } else {
      player.setLoop("queue");
    }
  }

  const data = await GSetup.get(`${message.guild.id}_${client.user.id}`);
  if (data && data.setup_enable === true) return;

  const prefix = client.prefix;

  const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(mention)) {
    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`My prefix is: \`${prefix}\``);
    message.channel.send({ embeds: [embed] })
  };

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
  if (!prefixRegex.test(message.content)) return;
  const [matchedPrefix] = message.content.match(prefixRegex);
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (!command) return;

  if (!client.dev.includes(message.author.id) && client.dev.length > 0) {
    message.channel.send(`${message.author}, You are not a developer!`);
    console.log(`[WARN] - ${message.author.tag} trying request the command from ${message.guild.name} (Not a developer)`);
    return;
  }

  const db = new Database(`./settings/models/access.json`, { databaseInObject: true });
  const database = (await db.get("whitelist")) || [];
  if (database.length > 0 && !database.includes(message.guild.id)) {
    message.channel.send(`${message.author}, Your need a whitelist server to use commands.`);
    console.log(`[WARN] - ${message.author.tag} trying request the command from ${message.guild.name} (Not Whitelisted)`);
    return;
  }

  console.log(`[COMMAND] - ${command.config.name} executed by ${message.author.tag} | ${client.user.username} in ${message.guild.name} (${message.guild.id})`);

  if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return message.author.dmChannel.send(`${message.author}, I don't have permission to send messages in ${message.guild.name}!`);
  if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewChannel)) return;
  if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return message.channel.send(`${message.author}, I don't have permission to embed links in ${message.guild.name}!`);
  if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.Speak)) return message.channel.send(`${message.author}, I don't have permission to speak in ${message.guild.name}!`);
  if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.Connect)) return message.channel.send(`${message.author}, I don't have permission to connect to voice channels in ${message.guild.name}!`);

  try {
    if (command.ownerOnly) {
      if (message.author.id !== client.owner) {
        return message.channel.send(`${message.author}, You are not the owner!`);
      }
    }
    command.run(client, message, args);
  } catch (error) {
    console.log(error)
    await message.channel.send(`${message.author}, an error occured!`);
  }
}