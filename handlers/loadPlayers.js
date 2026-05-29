module.exports = async (client) => {
    require("./Players/loadPlayer.js")(client);
    require("./Players/loadTrack.js")(client);
    require("./Players/loadContent.js")(client);
    require("./Players/loadSetup.js")(client);
    require("./Players/loadUpdate.js")(client);
};