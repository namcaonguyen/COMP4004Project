// Cypress Test for Course Management.
describe("Course Management (Creation/Editing/Deletion)", function() {
	// Declaration of constants.
	const typedCourseCode1 = "NAMO1001";
	const typedTitle1 = "How to be Rad";
	const typedCourseCode2 = "YEAH1001";
	const typedTitle2 = "A Good Course";
	const typedCourseCode3 = "EXCL1001";
	const typedTitle3 = "Top Secret Course";
	const typedEditedTitle = "This is an edit!!!";
	const typedInvalidCourseCode = "1001NAMO";

	
	// Before each test...
	beforeEach(function() {
		// Cypress Task to clear the database.
		cy.task('clearDatabase');
	})

	// Test that an administrator can create, edit, and delete a Course.
	it("Administrator User creates a Course, edits it, and deletes it", function() {
		// Visit the Login page by URL.
		cy.visit("http://127.0.0.1:3000/");

		// Login as an administrator.
		cy.get("input[id='inputEmail']")
			.type("admin@admin.com");
		cy.get("input[id='inputPassword']")
			.type("password");
		cy.get("button[name='login']").click();

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

		// Click the 'Create New Course' button to create a new Course.
		cy.get("a[name='createNewCourse']").click();
		// Type text into the input field for the Course Code.
		cy.get("input[id='courseCode']")
			.type(typedCourseCode2);
		// Type text into the input field for the Title.
		cy.get("input[id='title']")
			.type(typedTitle2);
		// Select the 'NAMO1001' value for the Prereq field.
		cy.get("select[name='prereqs']")
			.select(typedCourseCode1);
		// Click the 'CREATE COURSE' button to create the Course.
		cy.get("button[name='createCourse']").click();

		// Assert that the Course appears on the Course page.
		cy.get("h5[id='YEAH1001Label']")
			.should("exist");
		cy.get("h6[id='YEAH1001Title']")
			.should("exist");

		// Click the 'Create New Course' button to create a new Course.
		cy.get("a[name='createNewCourse']").click();
		// Type text into the input field for the Course Code.
		cy.get("input[id='courseCode']")
			.type(typedCourseCode3);
		// Type text into the input field for the Title.
		cy.get("input[id='title']")
			.type(typedTitle3);
		// Select the 'NAMO1001' value for the Precludes field.
		cy.get("select[name='precludes']")
			.select(typedCourseCode1);
		// Click the 'CREATE COURSE' button to create the Course.
		cy.get("button[name='createCourse']").click();

		// Assert that the Course appears on the Course page.
		cy.get("h5[id='EXCL1001Label']")
			.should("exist");
		cy.get("h6[id='EXCL1001Title']")
			.should("exist");

		// Click the 'EDIT COURSE' button for NAMO1001 to edit the Course.
		cy.get("button[name='NAMO1001EditButton']").click();
		// Type text into the input field for the Title.
		cy.get("input[id='title']").clear()
			.type(typedEditedTitle);
		// Select the 'YEAH1001' value for a Prerequisite to add field.
		cy.get("select[name='prereqsToAdd']")
			.select(typedCourseCode2);
		// Click the 'UPDATE COURSE INFORMATION' button to update the Course information.
		cy.get("button[name='updateCourseInformation']").click();

		// Click the 'EDIT COURSE' button for YEAH1001 to edit the Course.
		cy.get("button[name='YEAH1001EditButton']").click();
		// Select the 'NAMO1001' value for a Prerequisite to remove field.
		cy.get("select[name='prereqsToRemove']")
			.select(typedCourseCode1);
		// Select the 'NAMO1001' value for a Preclude to add field.
		cy.get("select[name='precludesToAdd']")
			.select(typedCourseCode1);
		// Click the 'UPDATE COURSE INFORMATION' button to update the Course information.
		cy.get("button[name='updateCourseInformation']").click();

		// Click the 'EDIT COURSE' button for EXCL1001 to edit the Course.
		cy.get("button[name='EXCL1001EditButton']").click();
		// Select the 'NAMO1001' value for a Preclude to remove field.
		cy.get("select[name='precludesToRemove']")
			.select(typedCourseCode1);
		// Click the 'UPDATE COURSE INFORMATION' button to update the Course information.
		cy.get("button[name='updateCourseInformation']").click();

		// Click the 'DELETE' button for EXCL1001 to delete it.
		cy.get("button[id='EXCL1001DeleteButton']").click();

		// Assert that the deleted Course is no longer displayed.
		cy.get("h5[id='EXCL1001Label']")
			.should("not.exist");
	})

	// Course Creation Form Submissions for invalid inputs
	context("Course Creation - Invalid Inputs", function() {
		// Test that you can't create a Course with an empty Course Code.
		it("Tries to create a Course with an empty Course Code", function() {
			// Visit the Login page by URL.
			cy.visit("http://127.0.0.1:3000/");

			// Login as an administrator.
			cy.get("input[id='inputEmail']")
				.type("admin@admin.com");
			cy.get("input[id='inputPassword']")
				.type("password");
			cy.get("button[name='login']").click();
			
			// View the Courses page.
			cy.get("a[name='manageCourses']").click();

			// Click the 'Create New Course' button to create a new Course.
			cy.get("a[name='createNewCourse']").click();
			// Type text into the input field for the Title.
			cy.get("input[id='title']")
				.type(typedTitle1);
			// Click the 'CREATE COURSE' button to try to create the Course.
			cy.get("button[name='createCourse']").click();

			// Assert that the input field for the Title is unchanged.
			cy.get("input[id='title']")
				.should("have.value", typedTitle1);
		})

		// Test that you can't create a Course with an empty Title.
		it("Tries to create a Course with an empty Title", function() {
			// Visit the Login page by URL.
			cy.visit("http://127.0.0.1:3000/");

			// Login as an administrator.
			cy.get("input[id='inputEmail']")
				.type("admin@admin.com");
			cy.get("input[id='inputPassword']")
				.type("password");
			cy.get("button[name='login']").click();
			
			// View the Courses page.
			cy.get("a[name='manageCourses']").click();

			// Click the 'Create New Course' button to create a new Course.
			cy.get("a[name='createNewCourse']").click();
			// Type text into the input field for the Course Code.
			cy.get("input[id='courseCode']")
				.type(typedCourseCode1);
			// Click the 'CREATE COURSE' button to try to create the Course.
			cy.get("button[name='createCourse']").click();

			// Assert that the input field for the Course Code is unchanged.
			cy.get("input[id='courseCode']")
				.should("have.value", typedCourseCode1);
		})

		// Test that you can't create a Course with an invalid Course Code.
		it("Tries to create a Course with an invalid Course Code", function() {
			// Visit the Login page by URL.
			cy.visit("http://127.0.0.1:3000/");

			// Login as an administrator.
			cy.get("input[id='inputEmail']")
				.type("admin@admin.com");
			cy.get("input[id='inputPassword']")
				.type("password");
			cy.get("button[name='login']").click();
			
			// View the Courses page.
			cy.get("a[name='manageCourses']").click();

			// Click the 'Create New Course' button to create a new Course.
			cy.get("a[name='createNewCourse']").click();
			// Type invalid text into the input field for the Course Code.
			cy.get("input[id='courseCode']")
				.type(typedInvalidCourseCode);
			// Type text into the input field for the Title.
			cy.get("input[id='title']")
				.type(typedTitle1);
			// Click the 'CREATE COURSE' button to try to create the Course.
			cy.get("button[name='createCourse']").click();

			// Get the error div that should appear after a failed Course creation attempt.
			cy.get("div[id='courseCreation-error-div']")
				.should("exist");
			// Assert that the input fields are now empty.
			cy.get("input[id='courseCode']")
				.should("have.value", "");
			cy.get("input[id='title']")
				.should("have.value", "");
		})
	})
})