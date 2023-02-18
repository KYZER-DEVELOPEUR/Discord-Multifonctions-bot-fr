const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel } = Partials;
const { ChargementEvenements } = require("./Handlers/event");
const { ChargementCommande } = require("./Handlers/commande");
const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages],
  partials: [User, Message, GuildMember, ThreadMember],
});

client.commands = new Collection();
client.bot = require("./Config/bot.json");

client.login(client.bot.token).then(() => {
  ChargementEvenements(client);
  ChargementCommande(client);
});