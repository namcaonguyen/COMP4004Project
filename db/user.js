const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var userSchema  = new Schema({
    email: String,
    password: String,
    fullname: String,
    accountType: {type: String, enum: ["student", "professor", "administrator"]},
    coursesTaken: [String],
    approved: Boolean
});

module.exports = mongoose.model("User", userSchema);