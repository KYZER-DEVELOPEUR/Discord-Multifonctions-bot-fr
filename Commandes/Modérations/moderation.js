const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { EMOJIS } = require("../../Config/emoji.json");
const { Couleur } = require("../../Config/couleur.json");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("moderation")
    .setDescription("Commande de modérations")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("effacer")
        .setDescription("Efface des messages sur le serveur.")
        .addIntegerOption((option) =>
          option
            .setName("nombre")
            .setDescription("Combien de messages voulez-vous supprimer ?")
            .setMinValue(1)
            .setMaxValue(99)
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("utilisateur")
            .setDescription(
              "Souhaitez-vous supprimer les message envoyer par une certaine personne ?"
            )
            .setRequired(false)
        )
    ),

  async execute(interaction) {
    const { channel, options } = interaction;

    const nombre = options.getInteger("nombre");
    const utilisateur = options.getUser("utilisateur");

    const messages = await channel.messages.fetch({
      limit: nombre + 1,
    });

    const res = new EmbedBuilder().setColor(Couleur.normal);
    setTimeout(() => interaction.deleteReply(), 3000);

    if (utilisateur) {
      let i = 0;
      const filtered = [];

      messages.filter((msg) => {
        if (msg.author.id === utilisateur.id && nombre > i) {
          filtered.push(msg);
          i++;
        }
      });

      await channel.bulkDelete(filtered).then((messages) => {
        res.setDescription(
          `${EMOJIS.Valider} ${messages.size} messages de ${utilisateur} on été supprimer !`
        );
        interaction.reply({ embeds: [res] });
      });
    } else {
      await channel.bulkDelete(nombre, true).then((messages) => {
        res.setDescription(
          `${EMOJIS.Valider} ${messages.size} messages ont été supprimés de ce salon !`
        );
        interaction.reply({ embeds: [res] });
      });
    }
  },
};
