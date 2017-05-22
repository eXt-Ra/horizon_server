const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const positionSchema = new Schema(
    {
        idPosition: { type: String, required: true, unique: true},
        numPosition: { type: String, required: true, unique: true},
        refClient: String,
        nbColis: Number,
        nbPalette: Number,
        nbColisFictif: Number,
        poids: Number,
        ml: Number,
        col: Number,
        colisSurPal: Number,
        dateImpLiv: Date,
        clientNom: String,
        expediteurNom: String,
        expediteurAdresse: String,
        expediteurVille: String,
        expediteurCp: String,
        chargementNom: String,
        chargementAdresse: String,
        chargementVille: String,
        chargementCp: Number,
        livraisonNom: String,
        livraisonAdresse: String,
        livraisonVille: String,
        livraisonCp: Number,
        zoneQuaiTheorique: String,
        codebarre: Array,
        societe: String,
        evenement: Array
    });

const Position = mongoose.model("Position", positionSchema);

module.exports = {
    Position: Position,
    positionSchema: positionSchema
};
