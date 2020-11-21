const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const Class = require("../../db/class.js");
const User = require("../../db/user.js");
const {
	tryToUpdateClassInformation
} = require("../../js/classManagement.js");

// Set up the MongoDB.
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cmsApp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

let result;

When("An administrator tries to switch professors and change the capacity of the Class to {int}", async function(capacityParam) {
	// Try to update the Class information. This will use the most recently created Object IDs that were stored.
	result = await tryToUpdateClassInformation(this.createdClassObjectID, this.createdProfessorUserObjectID, capacityParam);

	// Store the most recent capacity in a variable for use later.
	this.expectedTotalCapacity = capacityParam;
});

Then("The Class had its information successfully changed", async function() {
	assert(!!result.success);

	// Get the Class.
	const findClass = await Class.find({ _id: this.createdClassObjectID });

	// Assert that there is only one Class with this Object ID.
	assert.strictEqual(1, findClass.length);
	// Assert that the expected professor Object ID and the one found in the database are the same.
	assert.equal(true, this.createdProfessorUserObjectID.equals(findClass[0].professor));
	// Assert that the expected capacity and the one found in the database are the same.
	assert.strictEqual(this.expectedTotalCapacity, findClass[0].totalCapacity);
});

When("The professor was deleted", async function() {
	// Delete the most recently created professor User.
	await User.deleteOne( { _id: this.createdProfessorUserObjectID } );
});

Then("The Class information is not updated", function() {
	assert(!result.success);
	assert(!!result.errorArray);
});