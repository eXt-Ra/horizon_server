const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const {positionSchema} = require("./position");

const chargementSchema = new Schema({
        token: {type: String, required: true, unique: true},
        status: {type: String, required: true},
        dateCrea: {type: Date, required: true},
        userCrea: {type: String, required: true},
        logs: Array,
        positions: Array,
        users: Array,
        groupage: String,
        societe: {type: String, required: true},
        zone: {type: String, required: true}
    },
    {usePushEach: true});

const Chargement = mongoose.model("Chargement", chargementSchema);
module.exports = Chargement;
