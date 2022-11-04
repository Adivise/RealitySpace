const Client = require("../../index.js");
const { Player } = require("erela.js");

    /**
     * 
     * @param {Client} client 
     * @param {Player} player 
     * @param {String} oldChannel
     * @param {String} newChannel
     */

module.exports = async (client, player, oldChannel, newChannel) => {
      const guild = client.guilds.cache.get(player.guild)
      if(!guild) return;

      const channel = guild.channels.cache.get(player.textChannel);
      if (!channel) return;

        if(oldChannel === newChannel) return;
        if(newChannel === null || !newChannel) {
        if(!player) return;

        return player.destroy();
      } else {
        player.voiceChannel = newChannel;

        return player.destroy();
      }

}