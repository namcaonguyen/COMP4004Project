const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const User = require("../../db/user.js");
const Class = require("../../db/class.js");
const Course = require("../../db/course.js");
const ClassEnrollment = require("../../db/classEnrollment.js");
const {
	tryDropClassNoDR
} = require("../../js/classEnrollmentManagement.js");

// Set up the MongoDB.
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cmsApp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

async function emailAndCourseCodeToStudentIDAndClassID(email, courseCode) {
	const studentID = await User.find({ email: email, accountType: "student" });
	const enrollments = await ClassEnrollment.find({student: studentID});
	for(const enrollment of enrollments) {
		const classID = enrollment.class;
		const classes = await Class.find({_id: classID});
		assert.strictEqual(1, classes.length); // should only be one class per _id
		const class_ = classes[0];
		
		const courses = await Course.find({_id: class_.course});
		assert.strictEqual(1, courses.length); // should only be one course per _id
		const course = courses[0];

		if(course.courseCode != courseCode) continue; // wrong enrollment, check the others

		return {
			studentID, classID
		};
	}
}

Then("Student with email {string} successfully drops class for course with code {string} for no DR", async function(email, courseCode) {
	const studentIDAndClassID = await emailAndCourseCodeToStudentIDAndClassID(email, courseCode);
	if(!studentIDAndClassID) throw new Error("Student was not enrollment in any classes with course code");
	const {studentID, classID} = studentIDAndClassID;
	const {success, error} = await tryDropClassNoDR(studentID, classID);
	if(!success || error) throw new Error("Failed to drop class, error:", error);
});

Then("Student with email {string} is enrolled in class for course with code {string}", async function(email, courseCode) {
	const studentIDAndClassID = await emailAndCourseCodeToStudentIDAndClassID(email, courseCode);
	assert(studentIDAndClassID);
});

Then("Student with email {string} is not enrolled in class for course with code {string}", async function(email, courseCode) {
	const studentIDAndClassID = await emailAndCourseCodeToStudentIDAndClassID(email, courseCode);
	assert(!studentIDAndClassID);
});