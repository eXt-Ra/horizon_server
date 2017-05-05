const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userDcsSchema = new Schema({
    code: { type: String, required: true, unique: true },
    numeroPermis: { type: String, required: true, unique: true },
    societe: { type: String, required: true},
    connected: Boolean,
    lastConn: Date,
    firstConn: Date,
    socketId : String
});

userDcsSchema.pre("save", function(next) {
    const currentDate = new Date();
    this.lastConn = currentDate;


      // if created_at doesn't exist, add to that field
    if (!this.firstConn)
        this.firstConn = currentDate;

    next();
});

const UserDcs = mongoose.model("UserDcs", userDcsSchema);
module.exports = UserDcs;
