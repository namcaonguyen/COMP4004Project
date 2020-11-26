const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const User = require("../../db/user.js");
const Course = require("../../db/course.js");
const {
	tryToUpdateStudentPastCourses
} = require("../../js/courseManagement.js");

// Set up the MongoDB.
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cmsApp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

let result;

Given("There exists a {string} {string} with email {string} and password {string} and courses taken {string}", async function(accountTypeParam, fullNameParam, emailParam, passwordParam, coursesTakenParam) {
	// Split the Courses string by ',' into an array and remove the empty strings if any.
	setOfCourses = coursesTakenParam.split(",");
	setOfCourses = setOfCourses.filter(item => item);
	
	// Create a User object to save to the database.
	const createdUser = new User({
		email: emailParam,
		password: passwordParam,
		fullname: fullNameParam,
		accountType: accountTypeParam,
		coursesTaken: setOfCourses,
		approved: true
	});

	// Save the User to the database.
	await createdUser.save();

	// Find the new User in the database.
	var newCreatedUser = await User.find( { _id: createdUser._id, accountType: accountTypeParam } );

	// Assert that the newly created User was found in the database.
	assert.equal(true, newCreatedUser.length);

	// Store the most recently created User Object ID in a variable for use later.
	if ( accountTypeParam == "student" ) {
		this.createdStudentUserObjectID = createdUser._id;
	} else if ( accountTypeParam == "professor" ) {
		this.createdProfessorUserObjectID = createdUser._id;
	} else {
		this.createdAdministratorUserObjectID = createdUser._id;
	}
});

When("The student with email {string} tries to edit their past Courses to remove {string}, and add {string}", async function(emailParam, coursesToRemoveParam, coursesToAddParam) {
	// Split the Courses string by ',' into an array and remove the empty strings if any.
	setOfCoursesToRemove = coursesToRemoveParam.split(",");
	setOfCoursesToAdd = coursesToAddParam.split(",");
	setOfCoursesToRemove = setOfCoursesToRemove.filter(item => item);
	setOfCoursesToAdd = setOfCoursesToAdd.filter(item => item);

	// Try to update the Courses Taken of the student User.
	result = await tryToUpdateStudentPastCourses(this.createdStudentUserObjectID, setOfCoursesToRemove, setOfCoursesToAdd);
});

Then("The student with email {string} successfully had their Courses Taken attribute updated to {string}", async function(emailParam, updatedCoursesParam) {
	assert(!!result.success);

	// Split the Courses string by ',' into an array and remove the empty strings if any.
	setOfCourses = updatedCoursesParam.split(",");
	setOfCourses = setOfCourses.filter(item => item);

	// Get the student User object with the updated Courses Taken attribute.
	const findStudent = await User.find( { email: emailParam, coursesTaken: setOfCourses } );

	// Assert that there is only one student User with this email and the updated Courses Taken.
	assert.strictEqual(1, findStudent.length);
});

Then("The student information is not updated", function() {
	assert(!result.success);
	assert(!!result.error);
});