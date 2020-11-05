const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var userSchema  = new Schema({
    email: String,
    password: String,
    fullname: String,
    admin: Boolean,
    coursesEnrolled: [String],
    coursesTaken: [String]
});

module.exports = mongoose.model("User", userSchema);