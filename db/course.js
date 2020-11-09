const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var courseSchema  = new Schema({
    courseCode: String,
    title: String
});

module.exports = mongoose.model("Course", courseSchema);