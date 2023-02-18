const { SlashCommandBuilder, Message, Client, PermissionFlagsBits } = require("discord.js");
const bienvenueShema = require("../../Modeles/Bienvenue");
const { model, Schema } = require("mongoose");
const { Couleur } = require("../../Config/couleur.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bienvenue")
    .setDescription("Configuration du bienvenue")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName("salon")
        .setDescription("Salon auquel le message de bienvenue sera envoyé.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("titre")
        .setDescription("Titre de l'intégration.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("description de l'intégration.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("couleur")
        .setDescription("Couleur de l'intégration.")
        .addChoices(
          { name: "Par défaut", value: `${Couleur.normal}` },
          { name: "Blanc", value: `#ffffff` },
          { name: "Noir", value: `#000000` },
          { name: "Rouge", value: `#ff0000` },
          { name: "Vert", value: `#00ff00` },
          { name: "Bleu", value: `#0000ff` },
          { name: "Orange", value: `#ffa500` }
        )
        .setRequired(true)
    ),

  async execute(interaction) {
    const { guild, options } = interaction;
    const BienvenueSalon = options.getChannel("salon");
    const IntegrationTitre = options.getString("titre");
    const IntegrationDescription = options.getString("description");
    const IntegrationCouleur = options.getString("couleur");

    if (!guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
      interaction.reply({
        content: "Je n'ai pas la permission d'envoyer des messages !",
        ephemeral: true,
      });
    }

    bienvenueShema.findOne({ Serveur: guild.id }, async (err, data) => {
      if (!data) {
        const NouveauBienvenue = await bienvenueShema.create({
          Serveur: interaction.guild.id,
          Salon: BienvenueSalon.id,
          Titre: IntegrationTitre,
          Couleur: IntegrationCouleur,
          Description: IntegrationDescription,
        });
        interaction.reply({
          content: `Le salon de bienvenue a bien été configuré !`,
          ephemeral: true,
        });
      }
    });
  },
};
