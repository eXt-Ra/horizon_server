const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const configSchema = new Schema({
    name: { type: String, required: true, unique: true },
    societe: { type: String, required: true},
    isDefault: { type: Boolean, required: true},
});

const ConfigDCS = mongoose.model("configDCS", configSchema);
module.exports = ConfigDCS;
