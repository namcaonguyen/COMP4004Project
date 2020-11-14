const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const User = require("../../db/user.js");

Given("A user registers with the account info {string}, {string}, {string}, {string}", async function(accountTypeParam, fullnameParam, emailParam, passwordParam) {
    await User.deleteMany({});

    this.user = new User({
        email: emailParam,
        password: passwordParam,
        fullname: fullnameParam,
        accountType: accountTypeParam,
        approved: false
    });

    await this.user.save();
    assert(true);
});

When("The admin approves them", async function() {
    await User.updateOne({ _id: this.user._id }, { $set: { approved: true }}, function(err) {
        if (err) {
            assert(false);
            throw err;
        }
        assert(true);
    });
});

When("The admin declines them", async function() {
    await User.deleteOne({ _id: this.user._id }, function(err) {
        if (err) {
            assert(false);
            throw err;
        }
        assert(true);
    });
});

Then("The user does not exist in the database anymore", async function() {
    await User.find({ email: this.user.email, password: this.user.password }, function(err, result) {
        if (err) {
            assert(false);
            throw err;
        }
        assert.strictEqual(0, result.length);
    });
});

Then("The user is able to login", async function() {
    await User.find({ email: this.user.email, password: this.user.password }, function(err, result) {
        if ( err ) {
            assert(false);
            throw err;
        }
        assert.strictEqual(true, (result.length > 0 && result[0].approved));
    });
});

Then("The user is not able to login", async function() {
    await User.find({ email: this.user.email, password: this.user.password }, function(err, result) {
        if ( err ) {
            assert(false);
            throw err;
        }
        assert.strictEqual(true, (result.length === 0 || !result[0].approved));
    });
});