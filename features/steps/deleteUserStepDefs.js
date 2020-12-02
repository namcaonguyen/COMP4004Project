const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const User = require("../../db/user.js");
const Class = require("../../db/class.js");
const Deliverable = require("../../db/deliverable.js");
const DeliverableSubmission = require("../../db/deliverableSubmission.js");
const ClassEnrollment = require("../../db/classEnrollment.js");
const { tryUpdateSubmissionDeliverable } = require("../../js/classManagement.js");
const { tryToDeleteStudent } = require("../../js/accountManagement.js");
const { tryToDeleteProfessor } = require("../../js/accountManagement.js");
const { tryToDeleteAdministrator } = require("../../js/accountManagement.js");
const fs = require("fs");

Given("Student with email {string} submits a text file with name {string} and contents {string}", async function(emailParam, fileNameParam, contentsParam) {
	// Find the Deliverable object.
	var findDeliverable = await Deliverable.findById(this.createdDeliverableObjectID);
	// Find the student User object with the email.
	var findStudent = await User.find( { email: emailParam } );

	// Assert that the student was found.
	assert.equal(true, findStudent.length);

	fs.writeFileSync("uploads/" + fileNameParam, contentsParam);
	assert(true, await tryUpdateSubmissionDeliverable(this.createdClassObjectID, findStudent[0]._id, findDeliverable.title, fileNameParam));
});

When("Admin tries to delete the student with email {string}", async function(emailParam) {
	// Find the student User object with the email.
	var findStudent = await User.find( { email: emailParam } );

	// Assert that the student was found.
	assert.equal(true, findStudent.length);

	// Try to delete the student User.
	await tryToDeleteStudent(findStudent[0]._id);

	// Store the deleted student's ID in a variable, for use later.
	this.deletedStudentUserObjectID = findStudent[0]._id;
});

Then("All information pertaining to the deleted student was removed from the database", async function() {
	// Find any Deliverable Submissions with the deleted student User's ID.
	var findDeliverableSubmissions = await DeliverableSubmission.find( { student_id: this.deletedStudentUserObjectID } );
	// Find any Class Enrollments with the deleted student User's ID.
	var findClassEnrollments = await ClassEnrollment.find( { student: this.deletedStudentUserObjectID } );
	// Find any Users with the deleted student User's ID.
	var findUsers = await User.find( { _id: this.deletedStudentUserObjectID } );

	// Assert that nothing was found.
	assert.strictEqual(0, findDeliverableSubmissions.length);
	assert.strictEqual(0, findClassEnrollments.length);
	assert.strictEqual(0, findUsers.length);
});

When("Admin tries to delete the professor with email {string}", async function (emailParam) {
	// Find the professor User object with the email.
	var findProfessor = await User.find({ email: emailParam });

	// Assert that the professor was found.
	assert.equal(true, findProfessor.length);

	// Try to delete the professor User.
	await tryToDeleteProfessor(findProfessor[0]._id);

	// Store the deleted professor's ID in a variable, for use later.
	this.deletedProfessorUserObjectID = findProfessor[0]._id;
});

Then("The professor does not exist in the database", async function () {
	// Find any Users with the deleted professor's User ID.
	var findUsers = await User.find({ _id: this.deletedProfessorUserObjectID });

	// Assert that nothing was found.
	assert.strictEqual(0, findUsers.length);
});

Then("The professor still exists in the database", async function () {
	// Find any Users with the deleted professor's User ID.
	var findUsers = await User.find({ _id: this.deletedProfessorUserObjectID });

	// Assert that the prof was found.
	assert.strictEqual(1, findUsers.length);
});

When("Admin with email {string} tries to delete the administrator with email {string}", async function (adminRemoverEmailParam, victimAdminEmailParam) {
	// Find the administrator User object with the email.
	var victimAdmin = await User.find({ email: victimAdminEmailParam });
	var removerAdmin = await User.find({ email: adminRemoverEmailParam });

	const victimID = victimAdmin[0]._id;
	const removerID = removerAdmin[0]._id;

	// Assert that the admin was found.
	assert.equal(true, victimAdmin.length);
	
	// Try to delete the admin User.
	await tryToDeleteAdministrator(victimID, removerID);

	// Store the deleted admin's ID in a variable, for use later.
	this.deletedAdminUserObjectID = victimAdmin[0]._id;
});

Then("The attempted deleted administrator does not exist in the database", async function () {
	// Find any Users with the deleted admin's User ID.
	var findUsers = await User.find({ _id: this.deletedAdminUserObjectID });

	// Assert that nothing was found.
	assert.strictEqual(0, findUsers.length);
});

Then("The attempted deleted administrator still exists in the database", async function () {
	// Find any Users with the deleted admin's User ID.
	var findUsers = await User.find({ _id: this.deletedAdminUserObjectID });
	
	// Assert that nothing was found.
	assert.strictEqual(1, findUsers.length);
});