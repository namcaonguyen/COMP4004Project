const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const User = require("../../db/user.js");
const Class = require("../../db/class.js");
const Course = require("../../db/course.js");
const ClassEnrollment = require("../../db/classEnrollment.js");
const {
	tryDropClassNoDR,
	tryDropClassWithDR
} = require("../../js/classEnrollmentManagement.js");

// Set up the MongoDB.
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cmsApp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

async function findEnrollmentFromEmailAndCourseCode(email, courseCode) {
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

		return enrollment;
	}
}

// before deadline

When("Student with email {string} successfully drops class for course with code {string} for no DR", async function(email, courseCode) {
	const enrollment = await findEnrollmentFromEmailAndCourseCode(email, courseCode);
	if(!enrollment) throw new Error("Student was not enrollment in any classes with course code");
	const {student, class: class_} = enrollment;
	const {success, error} = await tryDropClassNoDR(student, class_);
	if(!success || error) throw new Error("Failed to drop class, error:" + error);
});

When("Student with email {string} fails to drop class for course with code {string} for no DR", async function(email, courseCode) {
	const enrollment = await findEnrollmentFromEmailAndCourseCode(email, courseCode);
	if(!enrollment) throw new Error("Student was not enrollment in any classes with course code");
	const {student, class: class_} = enrollment;
	const {success, error} = await tryDropClassNoDR(student, class_);
	assert(!success && error);
});

// after deadline

When("Student with email {string} successfully withdraws from the class for course with code {string} with DR", async function(email, courseCode) {
	const enrollment = await findEnrollmentFromEmailAndCourseCode(email, courseCode);
	if(!enrollment) throw new Error("Student was not enrollment in any classes with course code");
	const {student, class: class_} = enrollment;
	const {success, error} = await tryDropClassWithDR(student, class_);
	if(!success || error) throw new Error("Failed to drop class, error:" + error);
});

When("Student with email {string} fails to withdraw from the class for course with code {string} with DR", async function(email, courseCode) {
	const enrollment = await findEnrollmentFromEmailAndCourseCode(email, courseCode);
	if(!enrollment) throw new Error("Student was not enrollment in any classes with course code");
	const {student, class: class_} = enrollment;
	const {success, error} = await tryDropClassWithDR(student, class_);
	assert(!success && error);
});

// check if enrolled and/or withdrawn

Then("Student with email {string} is enrolled in class for course with code {string}", async function(email, courseCode) {
	const enrollment = await findEnrollmentFromEmailAndCourseCode(email, courseCode);
	assert(enrollment);
});

Then("Student with email {string} is not enrolled in class for course with code {string}", async function(email, courseCode) {
	const enrollment = await findEnrollmentFromEmailAndCourseCode(email, courseCode);
	assert(!enrollment);
});

Then("Student with email {string} has a grade of {string} in class for course with code {string}", async function(email, grade, courseCode) {
	const enrollment = await findEnrollmentFromEmailAndCourseCode(email, courseCode);
	assert.strictEqual(grade, enrollment.finalGrade);
});

Then("Student with email {string} does not have a grade of {string} in class for course with code {string}", async function(email, grade, courseCode) {
	const enrollment = await findEnrollmentFromEmailAndCourseCode(email, courseCode);
	assert.notStrictEqual(grade, enrollment.finalGrade);
});