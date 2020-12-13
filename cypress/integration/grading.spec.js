import "cypress-file-upload";

// Cypress Test for Grading
describe("Grading", () => {
    var results, url = "http://localhost:3000";

	// Before each test...
	beforeEach(function() {
        // Clear the database.
        cy.task('clearDatabase');
        // Populate the database with information for testing.
        cy.task('populateDBForDeliverableTesting').then(result => results = result);
	})

    // Test that a professor User can grade a Deliverable.
    it("Professor grades a Deliverable", function() {
        // Declaration of constants.
        const student = results[0];
        const professor = results[1];
        const class_ = results[3];
        const assignedDeliverableGrade = 89;

        // Visit the Login page.
        cy.visit(url);

		// Login to professor account.
		cy.get("input[id='inputEmail']").type(professor.email);
        cy.get("input[id='inputPassword']").type(professor.password);
        cy.get("button[name='login']").click();

        // Create a Deliverable.
        cy.visit(url + "/classes/" + class_._id + "/create-deliverable");
        cy.get("input[id='title']").type("A1");
        cy.get("input[id='weight']").type(15);
        const deadline = Cypress.moment().add(1, 'year').add(1, 'month').add(1, 'day').format('YYYY-MM-DD') + "T00:00";
        cy.get("input[id='deadline']").clear().type(`${deadline}`);
        cy.get("button[name='create']").click();

        // Logout of professor account.
        cy.visit(url + "/logout");

        // Login to student account.
		cy.get("input[id='inputEmail']").type(student.email);
        cy.get("input[id='inputPassword']").type(student.password);
        cy.get("button[name='login']").click();

        // Enroll in the Class.
        cy.visit(url + "/student/view-available-classes");
        cy.get("button[name='enrollInClass']").click();

        // View the Deliverable.
        cy.visit(url + "/classes/" + class_._id + "/A1");

        // Submit Deliverable Submission.
        cy.get("input[id='plagiarismCheck']").click();
        cy.get("input[id='deliverable_file']").attachFile("assignment1.txt");
        cy.get("button[type=submit]").click();
        cy.contains("Successfully submitted deliverable!");
        // Logout of student account.
        cy.visit(url + "/logout");

		// Login to professor account.
		cy.get("input[id='inputEmail']").type(professor.email);
        cy.get("input[id='inputPassword']").type(professor.password);
        cy.get("button[name='login']").click();

        // Click the 'View Assigned Classes' button.
        cy.get("a[name='viewAssignedClasses']").click();
        // View the Class page.
        cy.get("a[name='COMP4004ClassButton']").click();

        // Select the 'Zahid Dawod' value for the Account Type field.
        cy.get("select[name='selectStudent']")
            .select("Zahid Dawod");
        // Type text into the input field for the Deliverable grade.
        cy.get("input[id='A1DeliverableGrade']")
            .type(assignedDeliverableGrade);
        // Click the 'Update' button to try and set the Deliverable grade.
        cy.get("input[id='A1UpdateButton']").click();

        // Assert that the grade for the Deliverable was updated.
        cy.get("h6[id='89Label']")
            .should("exist");
	})

    it("Professor submits a final grade for a student", function() {
        // Clear the database.
        cy.task('clearDatabase');
        // Populate the database with information for testing.
        cy.task('populateDBForDeliverableTesting').then(result => results = result);

        // Declaration of constants.
        const student = results[0];
        const professor = results[1];
        const class_ = results[3];
        const assignedFinalGrade = 70;

        // Visit the Login page.
        cy.visit(url);

        // Login to student account.
		cy.get("input[id='inputEmail']").type(student.email);
        cy.get("input[id='inputPassword']").type(student.password);
        cy.get("button[name='login']").click();

        // Enroll in the Class.
        cy.visit(url + "/student/view-available-classes");
        cy.get("button[name='enrollInClass']").click();

        // Logout of professor account.
        cy.visit(url + "/logout");

		// Login to professor account.
		cy.get("input[id='inputEmail']").type(professor.email);
        cy.get("input[id='inputPassword']").type(professor.password);
        cy.get("button[name='login']").click();

        // Click the 'View Assigned Classes' button.
        cy.get("a[name='viewAssignedClasses']").click();
        // View the Class page.
        cy.get("a[name='COMP4004ClassButton']").click();

        // Select the 'Zahid Dawod' value for the Account Type field.
        cy.get("select[name='selectStudent']")
            .select("Zahid Dawod");
        // Type text into the input field for the final grade.
        cy.get("input[name='finalGrade']")
            .type(assignedFinalGrade);
        // Click the 'Submit' button to try and set the final grade.
        cy.get("input[id='submitButton']").click();

        // Assert that the final grade was updated.
        cy.get("h6[id='70FinalLabel']")
            .should("exist");
	})
})