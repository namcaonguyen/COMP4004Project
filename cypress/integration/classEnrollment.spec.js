// Cypress Test for Class Enrollment.
describe("Class Enrollment (Creation/Editing/Deletion)", function () {
	// Declaration of constants.
	const typedFirstName1 = "Joe";
	const typedLastName1 = "Johnson";
	const typedProfessorEmail1 = "cypressprofessor@namcao.com";
	const typedPassword = "password";
	const typedFirstName2 = "TJ";
	const typedLastName2 = "Mendicino";
	const typedStudentEmail2 = "tj@cms.com";
	const typedCourseCode1 = "NAMO1001";
	const typedTitle1 = "How to be Rad";
	const typedCapacity = 2;

	// Before each test...
	beforeEach(function () {
		// Cypress Task to clear the database.
		cy.task('clearDatabase');
	})

	// Test that a student can enroll in a Class and then drop the class.
	it("Student User enrolls in a class and drops the class", function () {
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

		// Register an account for the student User.
		// Select the 'student' value for the Account Type field.
		cy.get("select[name='accountType']")
			.select("student");
		// Type text into the input field for the first name.
		cy.get("input[id='inputFirstName']")
			.type(typedFirstName2);
		// Type text into the input field for the email.
		cy.get("input[id='inputLastName']")
			.type(typedLastName2);
		// Type text into the input field for the password.
		cy.get("input[id='inputEmail']")
			.type(typedStudentEmail2);
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
		cy.get("button[id='tj@cms.comApproveButton']").click();
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

		// Logout and Login as a student and enroll in the class
		// Go back to the homepage.
		cy.get("a[name='home']").click();

		// Go back to the Login screen.
		cy.get("a[name='logout']").click();

		// Login as a student.
		cy.get("input[id='inputEmail']")
			.type("tj@cms.com");
		cy.get("input[id='inputPassword']")
			.type("password");
		cy.get("button[name='login']").click();

		// Click the 'Class Registration' button to view classes to register in.
		cy.get("a[name='class-registration']").click();

		// Click the 'SUBMIT' button to register into the Class.
		cy.get("button[name='enrollInClass']").click();

		// Click the 'Class Registration' button to view classes to register in.
		cy.get("a[name='view-enrolled-classes']").click();

		// Assert that the Class appears on the View Enrolled Classes page.
		cy.get("h5[id='theCourseCode']")
			.should("exist");

		// Now the student will drop the class
		cy.get("button[name='action']").click();

		// Assert that the Class does not appear on the View Enrolled Classes page.
		cy.get("h5[id='theCourseCode']")
			.should("not.exist");
	})
})