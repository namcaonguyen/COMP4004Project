const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var academicDeadlineSchema = new Schema({
	date: Date
});

module.exports = mongoose.model("AcademicDeadline", academicDeadlineSchema);