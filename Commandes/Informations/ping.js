const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { EMOJIS} = require("../../Config/emoji.json");
const { Couleur } = require("../../Config/couleur.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Obtenir la latence du bot et de l'API")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  execute(interaction) {
    const Ping = new EmbedBuilder()
    .setTitle(`${EMOJIS.PingPong} Pong !`)
    .addFields(
    { name: `${EMOJIS.Satellite} Latence`, value:`La latence du bot est ${Math.round(interaction.client.ws.ping)}ms`, inline: false},
    { name: `${EMOJIS.Antenne} Latence API`, value:`La latence de l'API est ${Math.round(Date.now() - interaction.createdTimestamp)}ms`, inline: false })
    .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
    .setColor(Couleur.normal)
    interaction.reply({ embeds: [Ping], ephemeral: true });
  },
};

