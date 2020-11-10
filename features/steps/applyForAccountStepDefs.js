const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const applicationValidation = require("../../public/js/applicationvalidation.js");
const User = require("../../db/user.js");

// Set up the MongoDB.
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cmsApp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

Given("There are no existing Users", async function() {
    // Delete all Users.
    await User.deleteMany({ }, function(err) {
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

    // Assert that no Users found, meaning they were all deleted.
    assert.equal(0, allUsers.length);
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

Then("Input fields are valid", async function() {
    // Check for errors in the inputs.
    this.errorArray = applicationValidation.CheckInputFieldValidity(this.accountType, this.firstName, this.lastName, this.email, this.password, this.confirmPassword);

    // Save the Error Array in a temporary variable.
    var errorArrayVar = this.errorArray;

    // Look for Users with the same email.
    await User.find({ email: this.email }, function(err, result) {
        if (err) throw err;
        // If a result was found, then push an error to the array.
        if (result.length !== 0) {
            errorArrayVar.push("This email is already in use.");
		}

        // Assert that there were no errors.
        assert.equal(true, errorArrayVar.length === 0);
    });

    this.errorArray = errorArrayVar;
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
        await createdUser.save();

        // The User has been saved.
        // After the User has been saved, look for the user in the database.
        var findUser = await User.find({ email: createdUser.email, password: createdUser.password, fullName: createdUser.fullName, accountType: createdUser.accountType, approved: false });

        // Assert that the created User was found.
        assert.equal(true, findUser.length != 0);
	} else {
     // If we reach this else statement that means something went wrong, so assert something that's false.
     assert.equal(1, 2);
	}
});

Then("Input fields are not valid with {int} errors", async function(numberOfErrors) {
    // Check for errors in the inputs.
    this.errorArray = applicationValidation.CheckInputFieldValidity(this.accountType, this.firstName, this.lastName, this.email, this.password, this.confirmPassword);
    
    // Save the Error Array in a temporary variable.
    var errorArrayVar = this.errorArray;

    // Look for Users with the same email.
    await User.find({ email: this.email }, function(err, result) {
        if (err) throw err;
        
        // If a result was found, then push an error to the array.
        if (result.length !== 0) {
            errorArrayVar.push("This email is already in use.");
		}

        // Assert that there were errors.
        assert.equal(errorArrayVar.length, numberOfErrors);
    });

    this.errorArray = errorArrayVar;
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

Given("A {string} user exists with name {string} email {string} and password {string}", function(accountTypeParam, fullNameParam, emailParam, passwordParam) {
    // Create the User object to save to the database.
    const createdUser = new User({
        email: emailParam,
        password: passwordParam,
        fullname: fullNameParam,
        accountType: accountTypeParam,
        approved: true
    });

    // Save the new User to the database.
    createdUser.save(function (err, createdUser) {
        if ( err ) {
            return console.error(err);
	    }
    });
});