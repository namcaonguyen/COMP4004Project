const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const User = require("../../db/user.js");

// Set up the MongoDB.
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cmsApp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

Given("There are no accounts in the database", async function () {
    // Delete all unapproved Users with this specific Account Type.
    await User.deleteMany({ }, function (err) {
        if (err) {
            return console.error(err);
        }
    });

    // Find all the Users in the database.
    var allUsers = await User.find(function (err, foundUsers) {
        if (err) {
            return console.error(err);
        } else {
            return foundUsers;
        }
    });

    // Assert that no unapproved users of the specific Account Type were found, meaning they were all deleted.
    assert.equal(0, allUsers.length);
});

Given("There is an {string} account made in the database with {string} and {string}", async function (accountTypeParam, userEmailParam, userPasswordParam) {
    // Create the User object to save to the database.
    const createdUser = new User({
        email: userEmailParam,
        password: userPasswordParam,
        fullname: "TJ Mendicino",
        accountType: accountTypeParam,
        approved: true
    });

    // Save the user to the database.
    createdUser.save(async function (err, createdUser) {
        if (err) {
            return console.error(err);
        } else {
            // The User has been saved.
        }
    });

});

When("A user tries to login with email {string} and password {string}", function (userEmailParam, userPasswordParam) {
    this.userEmail = userEmailParam;
    this.userPassword = userPasswordParam;
});

Then("User logs in", async function () {
    var findUser = await User.find({ email: this.userEmail, password: this.userPassword });

    assert.equal(true, findUser.length > 0);
});

Then("User fails to login", async function () {
    var findUser = await User.find({ email: this.userEmail, password: this.userPassword });

    assert.equal(true, findUser.length === 0);
});