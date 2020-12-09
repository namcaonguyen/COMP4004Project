// Cypress Test for Account Registration.
describe("Account Registration", function() {
	// Declaration of constants.
	const typedFirstName = "Joe";
	const typedLastName = "Johnson";
	const typedEmail = "cypresstest@namcao.com";
	const typedPassword = "password";
	const typedInvalidEmail = "bad";
	const typedShortPassword = "short";
	const typedMismatchedPassword = "awefdspasdfawfedfaewf";
	const typedStudentEmail = "cypressstudent@namcao.com";
	const typedProfessorEmail = "cypressprofessor@namcao.com";

	// Test that the Account Registration URL is correct.
	it("Account Registration URL is correct", function() {
		// Visit the Account Registration page by URL.
		cy.visit("http://127.0.0.1:3000/register");

		// Get the ID of the page's label to ensure we're on the correct page.
		cy.get("h5[id='accountRegistrationPage']")
			.should("exist");
	})

	// Test that the Account Registration page can be reached from the login page.
	it("Access Account Registration page from Login page via button", function() {
		// Visit the Login page.
		cy.visit('http://127.0.0.1:3000/');

		// Click the 'REGISTER' link to reach the Login page.
		cy.get("a[name='register']").click();

		// Get the ID of the page's label to ensure we're on the correct page.
		cy.get("h5[id='accountRegistrationPage']")
			.should("exist");
	})

	// Account Registration Form submissions for invalid inputs
	context("Account Registration - Invalid Inputs", function() {

		// Test that you can't register with an empty first name.
		it("Tries to register with an empty first name", function() {
			// Visit the Account Registration page by URL.
			cy.visit("http://127.0.0.1:3000/register");

			// Type text into the input field for the last name.
			cy.get("input[id='inputLastName']")
				.type(typedLastName);
			// Type text into the input field for the email.
			cy.get("input[id='inputEmail']")
				.type(typedEmail);
			// Type text into the input field for the password.
			cy.get("input[id='inputPassword']")
				.type(typedPassword);
			// Type text into the input field for the password confirmation.
			cy.get("input[id='inputConfirmPassword']")
				.type(typedPassword);

			// Click the 'SUBMIT REGISTRATION' button to try and submit the account registration.
			cy.get("button[name='submitRegistration']").click();

			// Assert that no error message is displayed.
			cy.get("div[id='accountregistration-error-div']")
				.should("not.exist");

			// Nothing will happen, because not all the fields had been filled out.
			// Assert that the input fields are unchanged.
			cy.get("input[id='inputLastName']")
				.should("have.value", typedLastName);
			cy.get("input[id='inputEmail']")
				.should("have.value", typedEmail);
			cy.get("input[id='inputPassword']")
				.should("have.value", typedPassword);
			cy.get("input[id='inputConfirmPassword']")
				.should("have.value", typedPassword);
		})

		// Test that you can't register with an empty last name.
		it("Tries to register with an empty last name", function() {
			// Visit the Account Registration page by URL.
			cy.visit("http://127.0.0.1:3000/register");

			// Type text into the input field for the first name.
			cy.get("input[id='inputFirstName']")
				.type(typedFirstName);
			// Type text into the input field for the email.
			cy.get("input[id='inputEmail']")
				.type(typedEmail);
			// Type text into the input field for the password.
			cy.get("input[id='inputPassword']")
				.type(typedPassword);
			// Type text into the input field for the password confirmation.
			cy.get("input[id='inputConfirmPassword']")
				.type(typedPassword);

			// Click the 'SUBMIT REGISTRATION' button to try and submit the account registration.
			cy.get("button[name='submitRegistration']").click();

			// Assert that no error message is displayed.
			cy.get("div[id='accountregistration-error-div']")
				.should("not.exist");

			// Nothing will happen, because not all the fields had been filled out.
			// Assert that the input fields are unchanged.
			cy.get("input[id='inputFirstName']")
				.should("have.value", typedFirstName);
			cy.get("input[id='inputEmail']")
				.should("have.value", typedEmail);
			cy.get("input[id='inputPassword']")
				.should("have.value", typedPassword);
			cy.get("input[id='inputConfirmPassword']")
				.should("have.value", typedPassword);
		})

		// Test that you can't register with an empty email.
		it("Tries to register with an empty email", function() {
			// Visit the Account Registration page by URL.
			cy.visit("http://127.0.0.1:3000/register");

			// Type text into the input field for the first name.
			cy.get("input[id='inputFirstName']")
				.type(typedFirstName);
			// Type text into the input field for the email.
			cy.get("input[id='inputLastName']")
				.type(typedLastName);
			// Type text into the input field for the password.
			cy.get("input[id='inputPassword']")
				.type(typedPassword);
			// Type text into the input field for the password confirmation.
			cy.get("input[id='inputConfirmPassword']")
				.type(typedPassword);

			// Click the 'SUBMIT REGISTRATION' button to try and submit the account registration.
			cy.get("button[name='submitRegistration']").click();

			// Assert that no error message is displayed.
			cy.get("div[id='accountregistration-error-div']")
				.should("not.exist");

			// Nothing will happen, because not all the fields had been filled out.
			// Assert that the input fields are unchanged.
			cy.get("input[id='inputFirstName']")
				.should("have.value", typedFirstName);
			cy.get("input[id='inputLastName']")
				.should("have.value", typedLastName);
			cy.get("input[id='inputPassword']")
				.should("have.value", typedPassword);
			cy.get("input[id='inputConfirmPassword']")
				.should("have.value", typedPassword);
		})

		// Test that you can't register with an password.
		it("Tries to register with an empty password", function() {
			// Visit the Account Registration page by URL.
			cy.visit("http://127.0.0.1:3000/register");

			// Type text into the input field for the first name.
			cy.get("input[id='inputFirstName']")
				.type(typedFirstName);
			// Type text into the input field for the email.
			cy.get("input[id='inputLastName']")
				.type(typedLastName);
			// Type text into the input field for the password.
			cy.get("input[id='inputEmail']")
				.type(typedEmail);
			// Type text into the input field for the password confirmation.
			cy.get("input[id='inputConfirmPassword']")
				.type(typedPassword);

			// Click the 'SUBMIT REGISTRATION' button to try and submit the account registration.
			cy.get("button[name='submitRegistration']").click();

			// Assert that no error message is displayed.
			cy.get("div[id='accountregistration-error-div']")
				.should("not.exist");

			// Nothing will happen, because not all the fields had been filled out.
			// Assert that the input fields are unchanged.
			cy.get("input[id='inputFirstName']")
				.should("have.value", typedFirstName);
			cy.get("input[id='inputLastName']")
				.should("have.value", typedLastName);
			cy.get("input[id='inputEmail']")
				.should("have.value", typedEmail);
			cy.get("input[id='inputConfirmPassword']")
				.should("have.value", typedPassword);
		})

		// Test that you can't register with an invalid email.
		it("Tries to register with an invalid email", function() {
			// Visit the Account Registration page by URL.
			cy.visit("http://127.0.0.1:3000/register");

			// Type text into the input field for the first name.
			cy.get("input[id='inputFirstName']")
				.type(typedFirstName);
			// Type text into the input field for the email.
			cy.get("input[id='inputLastName']")
				.type(typedLastName);
			// Type text into the input field for the password.
			cy.get("input[id='inputEmail']")
				.type(typedInvalidEmail);
			// Type text into the input field for the password confirmation.
			cy.get("input[id='inputPassword']")
				.type(typedPassword);
			// Type text into the input field for the password confirmation.
			cy.get("input[id='inputConfirmPassword']")
				.type(typedPassword);

			// Click the 'SUBMIT REGISTRATION' button to try and submit the account registration.
			cy.get("button[name='submitRegistration']").click();

			// Assert that no error message is displayed.
			cy.get("div[id='accountregistration-error-div']")
				.should("not.exist");

			// Nothing will happen, because the email is invalid.
			// Assert that the input fields are unchanged.
			cy.get("input[id='inputFirstName']")
				.should("have.value", typedFirstName);
			cy.get("input[id='inputLastName']")
				.should("have.value", typedLastName);
			cy.get("input[id='inputEmail']")
				.should("have.value", typedInvalidEmail);
			cy.get("input[id='inputConfirmPassword']")
				.should("have.value", typedPassword);
		})

		// Test that you can't register with a password that is too short.
		it("Tries to register with a password that is too short", function() {
			// Visit the Account Registration page by URL.
			cy.visit("http://127.0.0.1:3000/register");

			// Type text into the input field for the first name.
			cy.get("input[id='inputFirstName']")
				.type(typedFirstName);
			// Type text into the input field for the email.
			cy.get("input[id='inputLastName']")
				.type(typedLastName);
			// Type text into the input field for the password.
			cy.get("input[id='inputEmail']")
				.type(typedEmail);
			// Type text into the input field for the password confirmation.
			cy.get("input[id='inputPassword']")
				.type(typedShortPassword);
			// Type text into the input field for the password confirmation.
			cy.get("input[id='inputConfirmPassword']")
				.type(typedShortPassword);

			// Click the 'SUBMIT REGISTRATION' button to try and submit the account registration.
			cy.get("button[name='submitRegistration']").click();

			// Get the error div that should appear after a failed account registration attempt.
			cy.get("div[id='accountregistration-error-div']")
				.should("exist");
		})

		// Test that you can't register with mismatching passwords.
		it("Tries to register with mismatching passwords", function() {
			// Visit the Account Registration page by URL.
			cy.visit("http://127.0.0.1:3000/register");

			// Type text into the input field for the first name.
			cy.get("input[id='inputFirstName']")
				.type(typedFirstName);
			// Type text into the input field for the email.
			cy.get("input[id='inputLastName']")
				.type(typedLastName);
			// Type text into the input field for the password.
			cy.get("input[id='inputEmail']")
				.type(typedEmail);
			// Type text into the input field for the password confirmation.
			cy.get("input[id='inputPassword']")
				.type(typedPassword);
			// Type text into the input field for the password confirmation.
			cy.get("input[id='inputConfirmPassword']")
				.type(typedMismatchedPassword);

			// Click the 'SUBMIT REGISTRATION' button to try and submit the account registration.
			cy.get("button[name='submitRegistration']").click();

			// Get the error div that should appear after a failed account registration attempt.
			cy.get("div[id='accountregistration-error-div']")
				.should("exist");
		})

		// Test that you can't register with an email that already has an account.
		it("Tries to register with an email that already has an account", function() {
			// Visit the Account Registration page by URL.
			cy.visit("http://127.0.0.1:3000/register");

			// Type text into the input field for the first name.
			cy.get("input[id='inputFirstName']")
				.type(typedFirstName);
			// Type text into the input field for the email.
			cy.get("input[id='inputLastName']")
				.type(typedLastName);
			// Type text into the input field for the password.
			cy.get("input[id='inputEmail']")
				.type("admin@admin.com");
			// Type text into the input field for the password confirmation.
			cy.get("input[id='inputPassword']")
				.type(typedPassword);
			// Type text into the input field for the password confirmation.
			cy.get("input[id='inputConfirmPassword']")
				.type(typedPassword);

			// Click the 'SUBMIT REGISTRATION' button to try and submit the account registration.
			cy.get("button[name='submitRegistration']").click();

			// Get the error div that should appear after a failed account registration attempt.
			cy.get("div[id='accountregistration-error-div']")
				.should("exist");
		})
	})

	// Test that a student can register for an account, and login after getting approved by an administrator.
	it("Student registers for an account, and gets approved by an admin, and logs in", function() {
		// Cypress Task to clear the database.
		cy.task('clearDatabase');

		// Visit the Account Registration page by URL.
		cy.visit("http://127.0.0.1:3000/register");

		// Select the 'student' value for the Account Type field.
		cy.get("select[name='accountType']")
			.select("student");
		// Type text into the input field for the first name.
		cy.get("input[id='inputFirstName']")
			.type(typedFirstName);
		// Type text into the input field for the email.
		cy.get("input[id='inputLastName']")
			.type(typedLastName);
		// Type text into the input field for the password.
		cy.get("input[id='inputEmail']")
			.type(typedStudentEmail);
		// Type text into the input field for the password confirmation.
		cy.get("input[id='inputPassword']")
			.type(typedPassword);
		// Type text into the input field for the password confirmation.
		cy.get("input[id='inputConfirmPassword']")
			.type(typedPassword);

		// Click the 'SUBMIT REGISTRATION' button to try and submit the account registration.
		cy.get("button[name='submitRegistration']").click();

		// Login as an administrator.
		cy.get("input[id='inputEmail']")
			.type("admin@admin.com");
		cy.get("input[id='inputPassword']")
			.type("password");
		cy.get("button[name='login']").click();
		// View the Account Request.
		cy.get("a[name='viewAccountRequests']").click();
		// Approve the Account Request.
		cy.get("button[name='approve']").click();
		// Go back to the homepage.
		cy.get("a[name='home']").click();
		// Logout.
		cy.get("a[name='logout']").click();

		// Login as the newly created student.
		cy.get("input[id='inputEmail']")
			.type("admin@admin.com");
		cy.get("input[id='inputPassword']")
			.type("password");
		cy.get("button[name='login']").click();

		// Assert that the student was able to login.
		// Get the ID of the page's label to ensure we're on the correct page.
		cy.get("h5[id='welcomePage']")
			.should("exist");
	})

	// Test that a professor can register for an account, and login after getting approved by an administrator.
	it("Professor registers for an account, and gets approved by an admin, and logs in", function() {
		// Cypress Task to clear the database.
		cy.task('clearDatabase');

		// Visit the Account Registration page by URL.
		cy.visit("http://127.0.0.1:3000/register");

		// Select the 'professor' value for the Account Type field.
		cy.get("select[name='accountType']")
			.select("professor");
		// Type text into the input field for the first name.
		cy.get("input[id='inputFirstName']")
			.type(typedFirstName);
		// Type text into the input field for the email.
		cy.get("input[id='inputLastName']")
			.type(typedLastName);
		// Type text into the input field for the password.
		cy.get("input[id='inputEmail']")
			.type(typedProfessorEmail);
		// Type text into the input field for the password confirmation.
		cy.get("input[id='inputPassword']")
			.type(typedPassword);
		// Type text into the input field for the password confirmation.
		cy.get("input[id='inputConfirmPassword']")
			.type(typedPassword);

		// Click the 'SUBMIT REGISTRATION' button to try and submit the account registration.
		cy.get("button[name='submitRegistration']").click();

		// Login as an administrator.
		cy.get("input[id='inputEmail']")
			.type("admin@admin.com");
		cy.get("input[id='inputPassword']")
			.type("password");
		cy.get("button[name='login']").click();
		// View the Account Request.
		cy.get("a[name='viewAccountRequests']").click();
		// Approve the Account Request.
		cy.get("button[name='approve']").click();
		// Go back to the homepage.
		cy.get("a[name='home']").click();
		// Logout.
		cy.get("a[name='logout']").click();

		// Login as the newly created student.
		cy.get("input[id='inputEmail']")
			.type("admin@admin.com");
		cy.get("input[id='inputPassword']")
			.type("password");
		cy.get("button[name='login']").click();

		// Assert that the professor was able to login.
		// Get the ID of the page's label to ensure we're on the correct page.
		cy.get("h5[id='welcomePage']")
			.should("exist");
	})
})