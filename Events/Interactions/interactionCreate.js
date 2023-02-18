const { CommandInteraction, Events, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const reglementShema = require("../../Modeles/Reglement");

module.exports = {
  name: Events.InteractionCreate,

  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) { 
        interaction.reply({ content: "Commande obsolète !" }) 
      }
    
      command.execute(interaction, client);
    } else if (interaction.isButton()) {
      const { customId, member, guild } = interaction;
      if (customId !== "accepter_reglement") return;

      const reglementData = await reglementShema.findOne({ Serveur: guild.id });
      if (!reglementData) return console.log("Erreur : Règlement non trouvé.");

      const { Role: roleId } = reglementData;
      const role = guild.roles.cache.get(roleId);
      if (!role) return console.log("Erreur : Rôle non trouvé.");

      await member.roles.add(role);
      interaction.reply({
        content: `Vous avez accepté le règlement. Le rôle ${role.name} vous a été attribué.`,
        ephemeral: true,
      });

    } else {
      return;
    }
  },
}
