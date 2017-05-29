const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const configSchema = new Schema({
    name: { type: String, required: true, unique: true },
    societe: { type: String, required: true},
    isDefault: { type: Boolean, required: true},
    chargementMode: { type: String, required: true},
    logoutTime: { type: String, required: true},
    wrongZoneAlert: { type: Boolean, required: true}
});

const Config = mongoose.model("Config", configSchema);
module.exports = Config;
