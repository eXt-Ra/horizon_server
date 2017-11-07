const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const configSchema = new Schema({
    name: { type: String, required: true, unique: true },
    societe: { type: String, required: true},
    isDefault: { type: Boolean, required: true},
    chargementMode: { type: String, required: true},
    dechargementMode: { type: String, required: true},
    inventaireMode: { type: String, required: true},
    logoutTime: { type: String, required: true},
    wrongZoneAlert: { type: Boolean, required: true},
    scanManuel: { type: Boolean, required: true},
    scanZoneDechargement: { type: Boolean}
});

const ConfigDMS = mongoose.model("configDMS", configSchema);
module.exports = ConfigDMS;
