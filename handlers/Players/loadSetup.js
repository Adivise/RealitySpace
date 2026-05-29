const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");

module.exports = async (client) => {

    client.enSwitch = new ActionRowBuilder()
        .addComponents([
            new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setCustomId("spause")
                .setEmoji("⏯"),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("sprevious")
                .setEmoji("⬅"),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("sstop")
                .setEmoji("⏹"),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("sskip")
                .setEmoji("➡"),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setCustomId("sloop")
                .setEmoji("🔄"),
        ]);

    client.enSwitch2 = new ActionRowBuilder()
        .addComponents([
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("sshuffle")
                .setEmoji("🔀"),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setCustomId("svoldown")
                .setEmoji("🔉"),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("sclear")
                .setEmoji("🗑"),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setCustomId("svolup")
                .setEmoji("🔊"),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("squeue")
                .setEmoji("📋"),
        ]);

    client.diSwitch = new ActionRowBuilder()
        .addComponents([
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("spause")
                .setEmoji("⏯")
                .setDisabled(true),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("sprevious")
                .setEmoji("⬅")
                .setDisabled(true),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("sstop")
                .setEmoji("⏹")
                .setDisabled(true),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("sskip")
                .setEmoji("➡")
                .setDisabled(true),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("sloop")
                .setEmoji("🔄")
                .setDisabled(true),
        ]);

    client.diSwitch2 = new ActionRowBuilder()
        .addComponents([
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("sshuffle")
                .setEmoji("🔀")
                .setDisabled(true),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("svoldown")
                .setEmoji("🔉")
                .setDisabled(true),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("sclear")
                .setEmoji("🗑")
                .setDisabled(true),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("svolup")
                .setEmoji("🔊")
                .setDisabled(true),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("squeue")
                .setEmoji("📋")
                .setDisabled(true),
        ]);

    client.filterMenuRow = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("select_filter")
                .setPlaceholder("Choose a filter...")
                .addOptions(
                    [
                    { label: 'BassBoost', value: 'bassboost' },
                    { label: 'Nightcore', value: 'nightcore' },
                    { label: 'Vaporwave', value: 'vaporwave' },
                    { label: 'Echo', value: 'echo' },
                    { label: 'Flanger', value: 'flanger' },
                    { label: 'Gate', value: 'gate' },
                    { label: 'Haas', value: 'haas' },
                    { label: 'Karaoke', value: 'karaoke' },
                    { label: 'Mcompand', value: 'mcompand' },
                    { label: 'Phaser', value: 'phaser' },
                    { label: 'Reverse', value: 'reverse' },
                    { label: 'Surround', value: 'surround' },
                    { label: 'Tremolo', value: 'tremolo' },
                    { label: 'Earrape', value: 'earrape' },
                    { label: 'Earwax', value: 'earwax' },
                    { label: '3D', value: '3d' },
                    { label: 'Reset (Off)', value: 'off' }
            ])
    );
};