const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var userSchema  = new Schema({
    id: Schema.Types.ObjectId,
    email: String,
    password: String,
    fullname: String,
    accountType: String,
    coursesEnrolled: [String],
    coursesTaken: [String],
    approved: Boolean
});

module.exports = mongoose.model("User", userSchema);