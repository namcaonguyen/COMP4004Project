const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var classEnrollmentSchema = new Schema({
	student: { type: Schema.Types.ObjectId, ref: 'User' },
	class: { type: Schema.Types.ObjectId, ref: 'Class' },
	finalGrade: String
});

module.exports = mongoose.model("ClassEnrollment", classEnrollmentSchema);