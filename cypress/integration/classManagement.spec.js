// Cypress Test for Class Management.
describe("Class Management (Creation/Editing/Deletion)", function() {
	// Declaration of constants.
	const typedFirstName1 = "Joe";
	const typedLastName1 = "Johnson";
	const typedProfessorEmail1 = "cypressprofessor@namcao.com";
	const typedPassword = "password";
	const typedFirstName2 = "Boolean";
	const typedLastName2 = "Bob";
	const typedProfessorEmail2 = "cypressprofessor2@namcao.com";
	const typedCourseCode1 = "NAMO1001";
	const typedTitle1 = "How to be Rad";
	const typedCapacity = 2;
	const typedEditedCapacity = 10;
	const typedInvalidCapacity = 0;

	// Before each test...
	beforeEach(function() {
		// Cypress Task to clear the database.
		cy.task('clearDatabase');
	})

	// Test that an administrator can create, edit, and delete a Class.
	it("Administrator User creates a Class, edits it, and deletes it", function() {
		// Visit the Account Registration page by URL.
		cy.visit("http://127.0.0.1:3000/register");

		// Register an account for the first professor User.
		// Select the 'professor' value for the Account Type field.
		cy.get("select[name='accountType']")
			.select("professor");
		// Type text into the input field for the first name.
		cy.get("input[id='inputFirstName']")
			.type(typedFirstName1);
		// Type text into the input field for the email.
		cy.get("input[id='inputLastName']")
			.type(typedLastName1);
		// Type text into the input field for the password.
		cy.get("input[id='inputEmail']")
			.type(typedProfessorEmail1);
		// Type text into the input field for the password confirmation.
		cy.get("input[id='inputPassword']")
			.type(typedPassword);
		// Type text into the input field for the password confirmation.
		cy.get("input[id='inputConfirmPassword']")
			.type(typedPassword);
		// Click the 'SUBMIT REGISTRATION' button to try and submit the account registration.
		cy.get("button[name='submitRegistration']").click();

		// Click the 'REGISTER' link to reach the Account Registration page.
		cy.get("a[name='register']").click();

		// Register an account for the second professor User.
		// Select the 'professor' value for the Account Type field.
		cy.get("select[name='accountType']")
			.select("professor");
		// Type text into the input field for the first name.
		cy.get("input[id='inputFirstName']")
			.type(typedFirstName2);
		// Type text into the input field for the email.
		cy.get("input[id='inputLastName']")
			.type(typedLastName2);
		// Type text into the input field for the password.
		cy.get("input[id='inputEmail']")
			.type(typedProfessorEmail2);
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

		// View the Account Requests.
		cy.get("a[name='viewAccountRequests']").click();
		// Approve the Account Requests.
		cy.get("button[id='cypressprofessor@namcao.comApproveButton']").click();
		cy.get("button[id='cypressprofessor2@namcao.comApproveButton']").click();
		// Go back to the homepage.
		cy.get("a[name='home']").click();

		// View the Courses page.
		cy.get("a[name='manageCourses']").click();

		// Click the 'Create New Course' button to create a new Course.
		cy.get("a[name='createNewCourse']").click();
		// Type text into the input field for the Course Code.
		cy.get("input[id='courseCode']")
			.type(typedCourseCode1);
		// Type text into the input field for the Title.
		cy.get("input[id='title']")
			.type(typedTitle1);
		// Click the 'CREATE COURSE' button to create the Course.
		cy.get("button[name='createCourse']").click();

		// Assert that the Course appears on the Course page.
		cy.get("h5[id='NAMO1001Label']")
			.should("exist");
		cy.get("h6[id='NAMO1001Title']")
			.should("exist");

		// Go back to the homepage.
		cy.get("a[name='home']").click();

		// View the Classes page.
		cy.get("a[name='manageClasses']").click();

		// Click the 'Create New Class' button to create a new Class.
		cy.get("a[name='createNewClass']").click();
		// Type text into the input field for the Capacity.
		cy.get("input[id='capacity']")
			.type(typedCapacity);
		// Click the 'SUBMIT' button to create the Class.
		cy.get("button[name='createClass']").click();

		// Assert that the Class appears on the Class page.
		cy.get("h5[id='NAMO1001Label']")
			.should("exist");
		cy.get("h5[id='NAMO1001Title']")
			.should("exist");

		// Click the 'EDIT CLASS' button for NAMO1001 to edit the Class.
		cy.get("button[id='NAMO1001EditClassButton']").click();
		// Select the 'Boolean Bob' value for the professor to change field.
		cy.get("select[name='professor']")
			.select("Boolean Bob");
		// Type text into the input field for the Capacity.
		cy.get("input[id='capacity']").clear()
			.type(typedEditedCapacity);
		// Click the 'UPDATE CLASS INFORMATION' button to update the Class information.
		cy.get("button[name='updateClassInformationButton']").click();

		// Click the 'DELETE' button for the NAMO1001 Class to delete it.
		cy.get("button[id='NAMO1001DeleteButton']").click();

		// Assert that the deleted Course is no longer displayed.
		cy.get("h5[id='NAMO1001Label']")
			.should("not.exist");
	})

	// Class Creation Form Submissions for invalid inputs
	context("Class Creation - Invalid Inputs", function() {
		// Test that you can't create a Class with an empty Capacity.
		it("Tries to create a Class with an empty Capacity", function() {
			// Visit the Account Registration page by URL.
			cy.visit("http://127.0.0.1:3000/register");

			// Register an account for the first professor User.
			// Select the 'professor' value for the Account Type field.
			cy.get("select[name='accountType']")
				.select("professor");
			// Type text into the input field for the first name.
			cy.get("input[id='inputFirstName']")
				.type(typedFirstName1);
			// Type text into the input field for the email.
			cy.get("input[id='inputLastName']")
				.type(typedLastName1);
			// Type text into the input field for the password.
			cy.get("input[id='inputEmail']")
				.type(typedProfessorEmail1);
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

			// View the Account Requests.
			cy.get("a[name='viewAccountRequests']").click();
			// Approve the Account Requests.
			cy.get("button[id='cypressprofessor@namcao.comApproveButton']").click();

			// Go back to the homepage.
			cy.get("a[name='home']").click();

			// View the Courses page.
			cy.get("a[name='manageCourses']").click();

			// Click the 'Create New Course' button to create a new Course.
			cy.get("a[name='createNewCourse']").click();
			// Type text into the input field for the Course Code.
			cy.get("input[id='courseCode']")
				.type(typedCourseCode1);
			// Type text into the input field for the Title.
			cy.get("input[id='title']")
				.type(typedTitle1);
			// Click the 'CREATE COURSE' button to create the Course.
			cy.get("button[name='createCourse']").click();

			// Assert that the Course appears on the Course page.
			cy.get("h5[id='NAMO1001Label']")
				.should("exist");
			cy.get("h6[id='NAMO1001Title']")
				.should("exist");

			// Go back to the homepage.
			cy.get("a[name='home']").click();

			// View the Classes page.
			cy.get("a[name='manageClasses']").click();

			// Click the 'Create New Class' button to create a new Class.
			cy.get("a[name='createNewClass']").click();
			// Click the 'SUBMIT' button to create the Class.
			cy.get("button[name='createClass']").click();

			// Get the ID of the page's label to ensure the page is unchanged.
			cy.get("h5[id='createClassPage']")
				.should("exist");
		})

		// Test that you can't create a Class with an invalid Capacity.
		it("Tries to create a Class with an invalid Capacity", function() {
			// Visit the Account Registration page by URL.
			cy.visit("http://127.0.0.1:3000/register");

			// Register an account for the first professor User.
			// Select the 'professor' value for the Account Type field.
			cy.get("select[name='accountType']")
				.select("professor");
			// Type text into the input field for the first name.
			cy.get("input[id='inputFirstName']")
				.type(typedFirstName1);
			// Type text into the input field for the email.
			cy.get("input[id='inputLastName']")
				.type(typedLastName1);
			// Type text into the input field for the password.
			cy.get("input[id='inputEmail']")
				.type(typedProfessorEmail1);
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

			// View the Account Requests.
			cy.get("a[name='viewAccountRequests']").click();
			// Approve the Account Requests.
			cy.get("button[id='cypressprofessor@namcao.comApproveButton']").click();

			// Go back to the homepage.
			cy.get("a[name='home']").click();

			// View the Courses page.
			cy.get("a[name='manageCourses']").click();

			// Click the 'Create New Course' button to create a new Course.
			cy.get("a[name='createNewCourse']").click();
			// Type text into the input field for the Course Code.
			cy.get("input[id='courseCode']")
				.type(typedCourseCode1);
			// Type text into the input field for the Title.
			cy.get("input[id='title']")
				.type(typedTitle1);
			// Click the 'CREATE COURSE' button to create the Course.
			cy.get("button[name='createCourse']").click();

			// Assert that the Course appears on the Course page.
			cy.get("h5[id='NAMO1001Label']")
				.should("exist");
			cy.get("h6[id='NAMO1001Title']")
				.should("exist");

			// Go back to the homepage.
			cy.get("a[name='home']").click();

			// View the Classes page.
			cy.get("a[name='manageClasses']").click();

			// Click the 'Create New Class' button to create a new Class.
			cy.get("a[name='createNewClass']").click();
			// Type text into the input field for the Capacity.
			cy.get("input[id='capacity']")
				.type(typedInvalidCapacity);
			// Click the 'SUBMIT' button to create the Class.
			cy.get("button[name='createClass']").click();

			// Get the error div that should appear after a failed Class creation attempt.
			cy.get("div[id='classCreation-error-div']")
				.should("exist");
		})
	})
})