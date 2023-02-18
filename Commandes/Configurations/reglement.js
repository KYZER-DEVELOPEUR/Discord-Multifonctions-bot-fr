const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");
const { EMOJIS } = require("../../Config/emoji.json");
const { Couleur } = require("../../Config/couleur.json");
const reglementSchema = require("../../Modeles/Reglement");
const { model, Schema } = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reglement")
    .setDescription("Configuration du règlement.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("options")
        .setDescription("Options pour le reglement")
        .setRequired(true)
        .addChoices(
          { name: "Modifier", value: "modifier" },
          { name: "Configurer", value: "configurer" }
        )
    ),
  async execute(interaction) {
    const option = interaction.options.getString("options");
    const serverId = interaction.guildId;

    if (option === "modifier") {
      try {
        const result = await reglementSchema.findOne({ serverId: serverId });

        if (!result) {
          return interaction.reply("Aucun règlement n'a été configuré pour ce serveur.");
        }

        const embed = new EmbedBuilder()
          .setTitle("Configuration du règlement")
          .setColor(Couleur.normal)
          .addFields(
            { name: "Salon d'envoi", value: `<#${result.channelId}>`, inline: true },
            { name: "Rôle d'acceptation", value: `<@&${result.roleId}>`, inline: true }
          )
          .setTimestamp();

        return interaction.reply({ embeds: [embed], ephemeral: true });
      } catch (err) {
        console.log(err);
        return interaction.reply("Une erreur s'est produite lors de la recherche de la configuration du règlement.");
      }
    }

    if (option === "configurer") {
      const introduction = new EmbedBuilder()
        .setTitle("Configuration du règlement")
        .setDescription(`Cliquez sur le bouton "Configurer" ci-dessous pour configurer le règlement de ce serveur.`)
        .setColor(Couleur.normal)
        .setTimestamp();

      const configurerButton = new ButtonBuilder()
        .setLabel("Configurer")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("reglement_configurer");

      const actionRow = new ActionRowBuilder().addComponents(configurerButton);

      await interaction.reply({ embeds: [introduction], components: [actionRow], ephemeral: true });

      const filter = (interaction) => {
        return interaction.customId === "reglement_configurer" && interaction.user.id === interaction.member.user.id;
      };

      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

      collector.on("collect", async (interaction) => {
        const channelSelectMenu = new StringSelectMenuBuilder()
          .setCustomId("reglement_channel")
          .setPlaceholder("Sélectionnez le salon d'envoi")
          .addOptions(
            interaction.guild.channels.cache
              .filter((channel) => channel.type === "GUILD_TEXT")
              .map((channel) => {
                return { label: channel.name, value: channel.id };
              })
          )
    
        const roleSelectMenu = new StringSelectMenuBuilder()
          .setCustomId("reglement_role")
          .setPlaceholder("Sélectionnez le rôle d'acceptation")
          .addOptions(
            interaction.guild.roles.cache
              .filter((role) => role.name !== "@everyone")
              .map((role) => {
                return { label: role.name, value: role.id };
              })
          );
    
        const embed = new EmbedBuilder()
          .setTitle("Configuration du règlement")
          .setDescription(
            "Sélectionnez le salon d'envoi et le rôle d'acceptation pour le règlement."
          )
          .setColor(Couleur.normal)
          .setTimestamp();
    
          const actionRow = new ActionRowBuilder().addComponents(channelSelectMenu, roleSelectMenu);
        await interaction.update({ embeds: [embed], components: [actionRow] });
    
        const filter = (interaction) => {
          return (
            interaction.customId === "reglement_channel" ||
            interaction.customId === "reglement_role"
          );
        };
    
        const configCollector = interaction.channel.createMessageComponentCollector({
          filter,
          time: 60000,
        });
    
        configCollector.on("collect", async (interaction) => {
          if (interaction.customId === "reglement_channel") {
            const channelId = interaction.values[0];
            channelSelectMenu.setValue([channelId]);
    
            try {
              const roleMessage = await interaction.channel.send({
                content: "Sélectionnez le rôle d'acceptation pour le règlement.",
                components: [actionRow],
              });
    
              configCollector.on("collect", async (interaction) => {
                if (interaction.customId === "reglement_role") {
                  const roleId = interaction.values[0];
                  roleSelectMenu.setValue([roleId]);
    
                  try {
                    await reglementSchema.findOneAndUpdate(
                      { serverId: serverId },
                      {
                        serverId: serverId,
                        channelId: channelId,
                        roleId: roleId,
                      },
                      { upsert: true }
                    );
    
                    const successMessage = new EmbedBuilder()
                      .setTitle("Configuration du règlement")
                      .setDescription("Le règlement a été configuré avec succès.")
                      .setColor(Couleur.SUCCESS)
                      .setTimestamp();
    
                    return roleMessage.edit({ embeds: [successMessage], components: [] });
                  } catch (err) {
                    console.log(err);
                    const errorMessage = new EmbedBuilder()
                      .setTitle("Configuration du règlement")
                      .setDescription("Une erreur s'est produite lors de la configuration du règlement.")
                      .setColor(Couleur.ERROR)
                      .setTimestamp();
                    return roleMessage.edit({ embeds: [errorMessage], components: [] });
                  }
                }
              });
            } catch (err) {
              console.log(err);
              const errorMessage = new EmbedBuilder()
              .setTitle("Configuration du règlement")
              .setDescription("Une erreur s'est produite lors de la configuration du règlement.")
              .setColor(Couleur.ERROR)
              .setTimestamp();
            return interaction.update({ embeds: [errorMessage], components: [] });
          }}
        })
        collector.on("end", async (collected) => {
          if (collected.size === 0) {
            const timeoutMessage = new EmbedBuilder()
              .setTitle("Configuration du règlement")
              .setDescription("La configuration du règlement a expiré.")
              .setColor(Couleur.ERROR)
              .setTimestamp();
            return interaction.editReply({ embeds: [timeoutMessage], components: [] });
          }
        });
      })
    }
  }
}