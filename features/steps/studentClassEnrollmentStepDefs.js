const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const User = require("../../db/user.js");
const Class = require("../../db/class.js");
const Course = require("../../db/course.js");
const ClassEnrollment = require("../../db/classEnrollment.js");
const {
	getClassList,
	tryEnrollStudentInClass
} = require("../../js/classEnrollmentManagement.js");

// Set up the MongoDB.
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cmsApp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

let result;

Given("There are no existing Users in the database", async function() {
	// Delete all Users.
	await User.deleteMany({});

	// Find all the Users.
	const allUsers = await User.find({});

	// Assert that no Users are found, meaning they were all deleted.
	assert.strictEqual(allUsers.length, 0);
});

Given("There are no existing Classes in the database", async function() {
	// Delete all Classes.
	await Class.deleteMany({});

	// Find all the Classes.
	const allClasses = await Class.find({});

	// Assert that no Classes are found, meaning they were all deleted.
	assert.strictEqual(allClasses.length, 0);
});

When("Student User tries to view list of available Classes", async function() {
	// Get the list of available Classes.
	this.classList = await getClassList();
});

Then("There are no available Classes", function() {
	// Assert that there are no available Classes.
	assert.strictEqual(this.classList.length, 0);
});

Given("There are no existing Courses in the database", async function() {
	// Delete all Courses.
	await Course.deleteMany({});

	// Find all the Courses.
	const allCourses = await Course.find({});

	// Assert that no Courses are found, meaning they were all deleted.
	assert.strictEqual(allCourses.length, 0);
});

Given("There are no existing ClassEnrollments in the database", async function() {
	// Delete all Class Enrollments.
	await ClassEnrollment.deleteMany({});

	// Find all the Class Enrollments.
	const allClassEnrollments = await ClassEnrollment.find({});

	// Assert that no Class Enrollments are found, meaning they were all deleted.
	assert.strictEqual(allClassEnrollments.length, 0);
});

Given("There exists a Course {string} with title {string}", async function(courseCodeParam, titleParam) {
	// Create a Course object to save to the database.
	const createdCourse = new Course({
		courseCode: courseCodeParam,
		title: titleParam
	});

	// Save the Course to the database.
	await createdCourse.save();

	// Find the new Course in the database.
	var newCreatedCourse = await Course.find({ _id: createdCourse._id });

	// Assert that the newly created Course was found in the database.
	assert.equal(true, newCreatedCourse.length);

	// Store the most recently created Course Object ID in a variable for use later.
	this.createdCourseObjectID = createdCourse._id;
});

Given("There exists a Class for {string} with capacity {int}, prerequisites {string}, and precludes {string}", async function(courseCodeParam, totalCapacityParam, prereqParam, precludesParam) {
	// Get the Course Object ID.
	var foundCourse = await Course.find({ courseCode: courseCodeParam });
	// Assert that a Course was found.
	assert.equal(true, foundCourse.length);

	// Get the Professor Object ID.
	var foundProfessor = await User.find({ accountType: "professor" });
	// Assert that a professor User was found.
	assert.equal(true, foundProfessor.length);

	// Split the prerequisites and precludes by "," into an array and remove the empty strings if there are any.
	setOfPrereqs = prereqParam.split(",");
	setOfPrecludes = precludesParam.split(",");
	setOfPrereqs = setOfPrereqs.filter(item => item);
	setOfPrecludes = setOfPrecludes.filter(item => item);
	
	// Create a Class object to save to the database.
	const createdClass = new Class({
		course: foundCourse[0]._id,
		professor: foundProfessor[0]._id,
		totalCapacity: totalCapacityParam,
		prereqs: setOfPrereqs,
		precludes: setOfPrecludes
	});

	// Save the Class to the database.
	await createdClass.save();

	// Find the new Class in the database.
	var newCreatedClass = await Class.find({ _id: createdClass._id });

	// Assert that the newly created Class was found in the database.
	assert.equal(true, newCreatedClass.length);

	// Store the most recently created Class Object ID in a variable for use later.
	this.createdClassObjectID = createdClass._id;
});

Then("There are available Classes", function() {
	// Assert that there are Classes available.
	assert.equal(true, this.classList.length);
});

Then("Student with email {string} wants to enroll in the Class", async function(emailParam) {
	// Get the student User's Object ID.
	var currentStudentUser = await User.find({ email: emailParam, accountType: "student" });
	
	// Assert that a student User was found.
	assert.equal(true, currentStudentUser.length);

	// Try to create a record for this student's enrollment in the Class.
	result = await tryEnrollStudentInClass(currentStudentUser[0]._id, this.createdClassObjectID);
});

Then("Student is successfully enrolled", function() {
	assert(!!result.id);
});

Then("Student does not enroll and an error is returned", function() {
    assert(!result.id);
    assert(!!result.error);
});