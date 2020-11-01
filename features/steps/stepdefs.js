const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const User = require("../../models/user.js");

Given("X is {int} and Y is {int}", function(x, y) {
    this.x = x;
    this.y = y;
});

Given("A new is created", function() {
    this.user = new User();
});

When("We add x and y", function() {
    this.result = this.x + this.y;
});

When("The users name is {string}", function(name) {
    this.user.name = name;
});

When("The users age is {int}", function(age) {
    this.user.age = age;
});

When("The user is taking {string}", function(courses) {
    this.user.courses = courses.split(",");
});

Then("Output the user should be {string}", function(expectedOutput) {
    assert.strictEqual(expectedOutput, this.user.toString())
});

Then("The result should be {float}", function(expectedResult) {
    assert.strictEqual(this.result, expectedResult);
});