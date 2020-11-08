const express = require("express");
const router = express.Router();
const User = require("../db/user.js");

// This file contains functions for validating the inputs.
const applicationValidation = require("../public/js/applicationvalidation.js");

// GET the Account Registration 
router.get("/", (req, res) => {
    res.render("accountregistration", { title: "Account Registration" });
});

// Middleware to parse the body of the request.
router.use(express.json());
router.use(express.urlencoded());

// Handle a POST request on the Account Registration page.
router.post("/", (req, res) => {
    // Declaration of variables to store the request information.
    var accountTypeVar = req.body.accountType;
    var firstNameVar = req.body.inputFirstName;
    var lastNameVar = req.body.inputLastName;
    var fullNameVar = (firstNameVar.concat(" ")).concat(lastNameVar);
    var emailVar = req.body.inputEmail;
    var passwordVar = req.body.inputPassword;
    var confirmPasswordVar = req.body.inputConfirmPassword;

    // Check the inputs for errors.
    var errorArray = applicationValidation.CheckInputFieldValidity(accountTypeVar, firstNameVar, lastNameVar, emailVar, passwordVar, confirmPasswordVar);

    // If there are no problems with the inputs...
    if ( errorArray.length == 0 ) {
        // Proceed to create the user.
        const createdUser = new User({
            email: emailVar,
            password: passwordVar,
            fullname: fullNameVar,
            accountType: accountTypeVar,
            approved: false
		});

        // Save the unapproved user to the database. An administrator must later approve the user.
        createdUser.save(function (err, createdUser) {
            if ( err ) {
                return console.error(err);
	        }
        });

        // Go back to the Login page.
        res.render("login", { title: "Login" });
	} else {
        // Declaration of variable for an Error Message.
        var errorMessage = "ERROR" + ((errorArray.length > 1) ? "S:\n" : "");
        // Go through all the errors in the Error Array.
        for ( i = 0; i < errorArray.length; ++i ) {
            errorMessage += "- " + errorArray[i] + "\n";
		}
        // Stay on this page.
        res.render("accountregistration", { title: "Account Registration", error: errorMessage });
	}
});

module.exports = router;