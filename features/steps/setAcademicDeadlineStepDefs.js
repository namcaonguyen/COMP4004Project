const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const AcademicDeadline = require("../../db/academicDeadline.js");
const {
	getAcademicDeadline,
	tryToUpdateAcademicDeadline
} = require("../../js/academicDeadlineManagement.js");

// Set up the MongoDB.
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cmsApp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

let result;

Given("There is an Academic Deadline set in the database", async function() {
	// Look for a record in the Academic Deadline schema.
	var findAcademicDeadline = await AcademicDeadline.find({});

	// If there is no Academic Deadline in the database yet...
	if ( findAcademicDeadline.length === 0 ) {
		// Create an Academic Deadline and save it to the database.
		const createdAcademicDeadline = new AcademicDeadline({
		    date: new Date(2020, 11, 30, 23, 59, 59)
		});

		// Save a new Academic Deadline.
		await createdAcademicDeadline.save();
	} else {
		// Assert that there is only one Academic Deadline record.
		assert.strictEqual(1, findAcademicDeadline.length);
	}
});

When("The administrator wants to update the Academic Deadline to year {int}, month {int}, day {int}", async function(yearParam, monthParam, dayParam) {
	// Try to update the Academic Deadline with the given inputs.
	result = await tryToUpdateAcademicDeadline(yearParam, monthParam, dayParam);

	// Save the expected date in a variable.
	this.expectedAcademicDeadlineDate = new Date(yearParam, monthParam - 1, dayParam, 23, 59, 59);
});

Then("The Academic Deadline is successfully updated to year {int}, month {int}, day {int}", async function(yearParam, monthParam, dayParam) {
	assert(!!result.success);

	// Get the Academic Deadline in the database.
	var findAcademicDeadline = await AcademicDeadline.find({});

	// Assert that there is only one Academic Deadline record.
	assert.strictEqual(1, findAcademicDeadline.length);
	// Assert that the expected date and the one found in the database are the same.
	assert.strictEqual(this.expectedAcademicDeadlineDate.getTime(), findAcademicDeadline[0].date.getTime());
});

Then("The Academic Deadline is not updated", function() {
	assert(!result.success);
	assert(!!result.errorArray);
});