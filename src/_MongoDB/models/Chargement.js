const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const chargementSchema = new Schema({
    token: { type: String, required: true, unique: true},
    status: { type: String, required: true},
    dateCrea: { type: Date, required: true},
    userCrea: { type: String, required: true},
    logs: Array,
    positions: Array,
    users: Array,
    societe: { type: String, required: true},
    zone: { type: String, required: true}
});

const Chargement = mongoose.model("Chargement", chargementSchema);
module.exports = Chargement;
