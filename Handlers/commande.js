function ChargementCommande(client) {
  const fs = require("fs");
  const ascii = require("ascii-table");
  const table = new ascii().setHeading("Commandes", "Statut");

  let CommandesArray = [];

  const CommandesFolder = fs.readdirSync("./Commandes");
  for (const folder of CommandesFolder) {
    const CommandeFiles = fs
      .readdirSync(`./Commandes/${folder}`)
      .filter((file) => file.endsWith(".js"));

    for (const file of CommandeFiles) {
      const CommandeFile = require(`../Commandes/${folder}/${file}`);

      client.commands.set(CommandeFile.data.name, CommandeFile);

      CommandesArray.push(CommandeFile.data.toJSON());

      table.addRow(file, "chargé !");
      continue;
    }
  }
  client.application.commands.set(CommandesArray);

  return console.log(table.toString(), "\nEvenement chargés");
}

module.exports = { ChargementCommande };
