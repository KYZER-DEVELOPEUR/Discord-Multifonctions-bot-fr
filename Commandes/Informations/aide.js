const { ComponentType, EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require(`discord.js`);
const { nompage, emoji, iconlien } = require(`../../Config/Commandes/Informations/Aide/aide.json`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`aide`)
    .setDescription("afficher la liste des commandes"),
  async execute(interaction) {
    const emojis = {
      info: emoji.informations,
      mod: emoji.moderations,
      config: emoji.configurations,
      admin: emoji.ad

    }
  },
};
