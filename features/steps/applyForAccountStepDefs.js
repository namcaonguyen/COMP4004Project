const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const applicationValidation = require("../../public/js/applicationvalidation.js");
const User = require("../../db/user.js");

// Set up the MongoDB.
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cmsApp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

Given("There are no unapproved {string} applications", async function(accountTypeParam) {
    // Delete all unapproved Users with this specific Account Type.
    await User.deleteMany({ accountType: accountTypeParam, approved: false }, function(err) {
        if ( err ) {
            return console.error(err);
		}
	});

    // Find all the Users in the database.
    var allUsers = await User.find(function(err, foundUsers) {
        if ( err ) {
            return console.error(err);
	    } else {
            return foundUsers;
		}
	});

    // Boolean to keep track if an unapproved User was found.
    var foundUnapprovedUser = false;

    // Go through all the users.
    for ( i = 0; i < allUsers.length; ++i ) {
        // If a User in the list is unapproved and of this specific Account Type, set the boolean to true.
        if ( allUsers[i].approved === false && allUsers[i].accountType === accountTypeParam ) {
            foundUnapprovedUser = true;  
		}
	}

    // Assert that no unapproved users of the specific Account Type were found, meaning they were all deleted.
    assert.equal(false, foundUnapprovedUser);
});

When("A {string} user tries to apply with name {string} {string}", function(accountTypeParam, firstNameParam, lastNameParam) {
    this.accountType = accountTypeParam;
    this.firstName = firstNameParam;
    this.lastName = lastNameParam;
    this.fullName = (firstNameParam.concat(" ")).concat(lastNameParam);
});

When("User email is {string}", function(emailParam) {
    this.email = emailParam;
});

When("User password {string} is confirmed as {string}", function(passwordParam, confirmPasswordParam) {
    this.password = passwordParam;
    this.confirmPassword = confirmPasswordParam;
});

Then("Input fields are valid", function() {
    // Check for errors in the inputs.
    this.errorArray = applicationValidation.CheckInputFieldValidity(this.accountType, this.firstName, this.lastName, this.email, this.password, this.confirmPassword);

    // Assert that there were no errors.
    assert.equal(true, this.errorArray.length === 0);
});

Then("The Application is saved to the database", async function() {
    // If there were no errors, then we can proceed to save.
    if ( this.errorArray.length === 0 ) {
        // Create the User object to save to the database.
        const createdUser = new User({
            email: this.email,
            password: this.password,
            fullname: this.fullName,
            accountType: this.accountType,
            approved: false
        });

        // Save the unapproved user to the database.
        createdUser.save(async function (err, createdUser) {
            if ( err ) {
                return console.error(err);
	        } else {
                // The User has been saved.
                // After the User has been saved, look for the user in the database.
                var findUser = await User.find({ email: createdUser.email, password: createdUser.password, fullName: createdUser.fullName, accountType: createdUser.accountType, approved: false });

                // Assert that the created User was found.
                assert.equal(true, findUser.length != 0);
		    }
        });
	} else {
     // If we reach this else statement that means something went wrong, so assert something that's false.
     assert.equal(1, 2);
	}
});

Then("Input fields are not valid with {int} errors", function(numberOfErrors) {
    // Check for errors in the inputs.
    this.errorArray = applicationValidation.CheckInputFieldValidity(this.accountType, this.firstName, this.lastName, this.email, this.password, this.confirmPassword);

    // Assert that there were errors.
    assert.equal(true, this.errorArray.length == numberOfErrors);
});

Then("The Application is not saved to the database", async function() {
    // If there were no errors, then we can proceed to save. (THIS SHOULDN'T HAPPEN)
    if ( this.errorArray.length === 0 ) {
        // Create the User object to save to the database.
        const createdUser = new User({
            email: this.email,
            password: this.password,
            fullname: this.fullName,
            accountType: this.accountType,
            approved: false
        });

        // Save the unapproved user to the database.
        createdUser.save(async function (err, createdUser) {
            if ( err ) {
                return console.error(err);
	        } else {
                // The User has been saved.
                // After the User has been saved, look for the user in the database.
                var findUser = await User.find({ email: createdUser.email, password: createdUser.password, fullName: createdUser.fullName, accountType: createdUser.accountType, approved: false });

                // If we reach this line that means something went wrong, so assert something that's false.
                assert.equal(1, 2);
		    }
        });
	} else {
        // If there were errors, then nothing was saved. Check that the User isn't in the database.
        var findUser = await User.find({ email: this.email, password: this.password, fullName: this.fullName, accountType: this.accountType, approved: false });

        // Assert that no User was found.
        assert.equal(true, findUser.length === 0);
	}
});