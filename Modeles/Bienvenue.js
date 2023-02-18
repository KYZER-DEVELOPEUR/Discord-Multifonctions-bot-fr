const {model, Schema} = require('mongoose')

let bienvenueShema = new Schema({
    Serveur: String,
    Salon: String,
    Titre: String,
    Description: String,
    Couleur: String,
})

module.exports = model('Bienvenue', bienvenueShema)