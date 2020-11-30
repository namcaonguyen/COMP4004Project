// Cypress Test for Login input
describe('CMS Cypress Example', function() {
	// Before each test...
	beforeEach(function() {
		// Visit the Login page.
		cy.visit('http://127.0.0.1:3000/');
	})

	// Test that the input for the login is focused upon loading the page.
	it("Focuses input on load", function() {
		cy.focused()
			.should("have.id", "inputEmail");
	})

	// Test that the input fields accept input.
	it("Accepts input", function() {
		const typedText = "TestingTestingTestingInput123!!!";

		// Type text into the input field, and assert that its value matches exactly.
		cy.get("input[id='inputEmail']")
			.type(typedText)
			.should("have.value", typedText);
	})

	// Form submission tests for an unsuccessful login
	context("Form Submission - Unsuccessful Logins", function() {
		// Test that the form submits upon pressing the 'Enter' key while in the password field.
		it("Tries to login when the ENTER key is pressed", function() {
			const typedEmail = "bad@test.com";
			const typedPassword = "badpassbadpassbadpass";

			// Type text into the input field for the email.
			cy.get("input[id='inputEmail']")
				.type(typedEmail);
			// Type text into the input field for the password.
			cy.get("input[id='inputPassword']")
				.type(typedPassword)
				.type("{enter}");

			// Get the error div that should appear after a failed login attempt.
			cy.get("div[id='login-error-div']");
			// Assert that the input fields are now empty.
			cy.get("input[id='inputEmail']")
				.should("have.value", "");
			cy.get("input[id='inputPassword']")
				.should("have.value", "");
		})

		// Test that the form submits upon pressing the 'LOGIN' button.
		it("Tries to login when the LOGIN button is clicked", function() {
			const typedEmail = "bad@test.com";
			const typedPassword = "badpassbadpassbadpass";

			// Type text into the input field for the email.
			cy.get("input[id='inputEmail']")
				.type(typedEmail);
			// Type text into the input field for the password.
			cy.get("input[id='inputPassword']")
				.type(typedPassword);

			// Click the 'LOGIN' button to try and login.
			cy.get("button[name='login']").click();

			// Get the error div that should appear after a failed login attempt.
			cy.get("div[id='login-error-div']")
				.should("exist");
			// Assert that the input fields are now empty.
			cy.get("input[id='inputEmail']")
				.should("have.value", "");
			cy.get("input[id='inputPassword']")
				.should("have.value", "");
		})

		// Test that you can't try to login if the email field is empty.
		it("Tries to login with an empty email and FAILS (page is not reloaded)", function() {
			const typedPassword = "spaghetti";

			// Type text into the input field for the password.
			cy.get("input[id='inputPassword']")
				.type(typedPassword);

			// Click the 'LOGIN' button to try and login.
			cy.get("button[name='login']").click();

			// Assert that no error message is displayed.
			cy.get("div[id='login-error-div']")
				.should("not.exist");
			// Assert that the input field for the password is unchanged.
			cy.get("input[id='inputPassword']")
				.should("have.value", typedPassword);
		})

		// Test that you can't try to login if the password field is empty.
		it("Tries to login with an empty password and FAILS (page is not reloaded)", function() {
			const typedEmail = "really@cool.gov";

			// Type text into the input field for the email.
			cy.get("input[id='inputEmail']")
				.type(typedEmail);

			// Click the 'LOGIN' button to try and login.
			cy.get("button[name='login']").click();

			// Assert that no error message is displayed.
			cy.get("div[id='login-error-div']")
				.should("not.exist");
			// Assert that the input field for the email is unchanged.
			cy.get("input[id='inputEmail']")
				.should("have.value", typedEmail);
		})
	})
})