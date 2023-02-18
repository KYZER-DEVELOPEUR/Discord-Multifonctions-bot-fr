const { Client, Events } = require("discord.js");
const { connect } = require("mongoose")
module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    await connect(client.bot.mongodb || "", {
      keepAlive: true,
    })
    if (connect) {
      console.log("MongoDB est connecté !")
    }
    console.log(`${client.user.username} est enligne !`);
  },
};
