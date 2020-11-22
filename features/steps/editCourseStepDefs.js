const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const Course = require("../../db/course.js");
const {
	tryToUpdateCourseInformation
} = require("../../js/courseManagement.js");

// Set up the MongoDB.
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cmsApp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

let result;

When("The admin tries to change {string} title to {string}, and remove {string} and {string}, and add {string} and {string}", async function(courseCodeParam, titleParam, prereqsToRemoveParam, precludesToRemoveParam, prereqsToAddParam, precludesToAddParam) {
	// Find the Course Object.
	var findCourse = await Course.find( { courseCode: courseCodeParam } );

    // Split the prereqs and precludes by ',' into an array and remove the empty strings if any.
    setOfPrereqsToRemove = prereqsToRemoveParam.split(",");
    setOfPrecludesToRemove = precludesToRemoveParam.split(",");
	setOfPrereqsToAdd = prereqsToAddParam.split(",");
	setOfPrecludesToAdd = precludesToAddParam.split(",");
    setOfPrereqsToRemove = setOfPrereqsToRemove.filter(item => item);
    setOfPrecludesToRemove = setOfPrecludesToRemove.filter(item => item);
	setOfPrereqsToAdd = setOfPrereqsToAdd.filter(item => item);
	setOfPrecludesToAdd = setOfPrecludesToAdd.filter(item => item);

	// Try to update the Course Information.
	result = await tryToUpdateCourseInformation(findCourse[0]._id, titleParam, setOfPrereqsToRemove, setOfPrecludesToRemove, setOfPrereqsToAdd, setOfPrecludesToAdd);
});

Then("The {string} Course had its information successfully changed to title {string} and prerequisites {string} and precludes {string}", async function(courseCodeParam, titleParam, prereqsParam, precludesParam) {
	assert(!!result.success);

    // Split the prereqs and precludes by ',' into an array and remove the empty strings if any.
    setOfPrereqs = prereqsParam.split(",");
    setOfPrecludes = precludesParam.split(",");
    setOfPrereqs = setOfPrereqs.filter(item => item);
    setOfPrecludes = setOfPrecludes.filter(item => item);

	// Get the Course with the updated information.
	const findCourse = await Course.find({ courseCode: courseCodeParam, title: titleParam, prereqs: setOfPrereqs, precludes: setOfPrecludes });

	// Assert that there is only one Course with this Object ID and the updated information.
	assert.strictEqual(1, findCourse.length);
});

Then("The Course information is not updated", function() {
	assert(!result.success);
	assert(!!result.errorArray);
});