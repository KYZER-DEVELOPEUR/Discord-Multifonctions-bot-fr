const { EmbedBuilder, GuildMember, Embed, Events, InteractionCollector } = require("discord.js");
const { Couleur } = require("../../Config/couleur.json");
const bienvenueShema = require("../../Modeles/Bienvenue");


module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    bienvenueShema.findOne({ Serveur: member.guild.id }, async (err, data) => {
      if (!data) return console.log(err);
      let salon = data.Salon;
      let titre = data.Titre || ` `;
      let description = data.Description || ` `;
      let couleur = data.Couleur || Couleur.normal;

      const {user, guild} = member;
      const bienvenueSalon = member.guild.channels.cache.get(data.Salon);

      const embed = new EmbedBuilder()
      .setTitle(data.Titre)
      .setDescription(data.Description)
      .setFooter({ text: `${user.username}`, iconURL: user.displayAvatarURL() })
      .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
      .setColor(data.Couleur)
      .setTimestamp()

      bienvenueSalon.send({
        embeds: [embed],
        contents: `${user.username} a rejoint le serveur ${member.guild.name}`
      })
    })
  }
};
