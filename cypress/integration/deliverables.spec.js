import "cypress-file-upload";

// Cypress Test for Deliverable Features
describe("Deliverable Features (Create/View/Submit/Update/Delete)", () => {
    var results, url = "http://localhost:3000";

	before(() => {
        cy.task('clearDatabase');
        cy.task('populateDBForDeliverableTesting').then(result => results = result);
    });

	// Test that a professor can create, modify, and delete a deliverable
	it("Professor creates a deliverable, modifies it, and deletes it successfully", () => {
        const professor = results[1];
        const class_ = results[3];

		cy.visit(url); // visit the login page

		// login to professor account
		cy.get("input[id='inputEmail']").type(professor.email);
        cy.get("input[id='inputPassword']").type(professor.password);
        cy.get("button[name='login']").click();

        // create deliverable
        cy.visit(url + "/classes/" + class_._id + "/create-deliverable");
        cy.get("input[id='title']").type("A1");
        cy.get("input[id='weight']").type(15);
        const deadline = Cypress.moment().add(1, 'year').add(1, 'month').add(1, 'day').format('YYYY-MM-DD') + "T00:00";
        cy.get("input[id='deadline']").clear().type(`${deadline}`);
        cy.get("button[name='create']").click();

        // modify deliverable
        cy.visit(url + "/classes/" + class_._id + "/A1");
        cy.get("input[id='title']").type("A1");
        cy.get("input[id='weight']").type(25);
        cy.get("button[name='update']").click();

        // delete deliverable
        cy.visit(url + "/classes/" + class_._id + "/A1");
        cy.get("button[name='delete']").click();

        cy.visit(url + "/logout");
    });
    
	// Test that a student can submit a deliverable successfully
    it("Professor creates a deliverable, and student submits successfully", () => {
        const student = results[0];
        const professor = results[1];
        const class_ = results[3];

        // Visit the Login page.
        cy.visit(url);

		// login to professor account
		cy.get("input[id='inputEmail']").type(professor.email);
        cy.get("input[id='inputPassword']").type(professor.password);
        cy.get("button[name='login']").click();

        // create deliverable
        cy.visit(url + "/classes/" + class_._id + "/create-deliverable");
        cy.get("input[id='title']").type("A1");
        cy.get("input[id='weight']").type(15);
        const deadline = Cypress.moment().add(1, 'year').add(1, 'month').add(1, 'day').format('YYYY-MM-DD') + "T00:00";
        cy.get("input[id='deadline']").clear().type(`${deadline}`);
        cy.get("button[name='create']").click();

        // logout of professor account
        cy.visit(url + "/logout");

        // login to student account
		cy.get("input[id='inputEmail']").type(student.email);
        cy.get("input[id='inputPassword']").type(student.password);
        cy.get("button[name='login']").click();

        // register to the class
        cy.visit(url + "/student/view-available-classes");
        cy.get("button[name='enrollInClass']").click();

        // view deliverable
        cy.visit(url + "/classes/" + class_._id + "/A1");

        // submit deliverable
        cy.get("input[id='plagiarismCheck']").click();
        cy.get("input[id='deliverable_file']").attachFile("assignment1.txt");
        cy.get("button[type=submit]").click();
        cy.contains("Successfully submitted deliverable!");

        cy.visit(url + "/logout");
    });

	context("Deliverable Creation/Modification - Invalid Inputs", () => {
		it("Tries to create a Deliverable with a same title", () => {
            const professor = results[1];
            const class_ = results[3];

            // Visit the Login page.
            cy.visit(url);

            // login to professor account
            cy.get("input[id='inputEmail']").type(professor.email);
            cy.get("input[id='inputPassword']").type(professor.password);
            cy.get("button[name='login']").click();

            // try to create deliverable
            cy.visit(url + "/classes/" + class_._id + "/create-deliverable");
            cy.get("input[id='title']").type("A1");
            cy.get("input[id='weight']").type(15);
            cy.get("button[name='create']").click();

            cy.contains("ERROR- A deliverable with that title already exists in this class.");

            cy.visit(url + "/logout");
		});

		it("Tries to create a Deliverable with an invalid weight", () => {
            const professor = results[1];
            const class_ = results[3];

            // Visit the Login page.
            cy.visit(url);

            // login to professor account
            cy.get("input[id='inputEmail']").type(professor.email);
            cy.get("input[id='inputPassword']").type(professor.password);
            cy.get("button[name='login']").click();

            // try to create deliverable
            cy.visit(url + "/classes/" + class_._id + "/create-deliverable");
            cy.get("input[id='title']").type("A2");
            cy.get("input[id='weight']").type(-15);
            cy.get("button[name='create']").click();

            cy.contains("ERROR- The weight of the deliverable must be >= 0 and <= 100 %.");

            cy.visit(url + "/logout");
        });
        
		it("Tries to create a Deliverable with an invalid deadline", () => {
            const professor = results[1];
            const class_ = results[3];

            // Visit the Login page.
            cy.visit(url);

            // login to professor account
            cy.get("input[id='inputEmail']").type(professor.email);
            cy.get("input[id='inputPassword']").type(professor.password);
            cy.get("button[name='login']").click();

            // try to create deliverable
            cy.visit(url + "/classes/" + class_._id + "/create-deliverable");
            cy.get("input[id='title']").type("A2");
            cy.get("input[id='weight']").type(15);
            const deadline = Cypress.moment().add(-1, "days").format('YYYY-MM-DDTHH:MM');
            cy.get("input[id='deadline']").clear().type(`${deadline}`);
            cy.get("button[name='create']").click();

            cy.visit(url + "/classes/" + class_._id + "/A2");
            cy.contains("The deliverable you are requesting does not exist for this class.");

            cy.visit(url + "/logout");
		});
    });

    context("Deliverable Submission - Invalid Inputs", () => {
		it("Tries to submit a Deliverable without a file", () => {
            const student = results[0];
            const professor = results[1];
            const class_ = results[3];

            // Visit the Login page.
            cy.visit(url);

            // login to professor account
            cy.get("input[id='inputEmail']").type(professor.email);
            cy.get("input[id='inputPassword']").type(professor.password);
            cy.get("button[name='login']").click();

            // modify deliverable
            cy.visit(url + "/classes/" + class_._id + "/A1");
            cy.get("input[id='title']").type("A1");
            cy.get("input[id='weight']").type(25);
            cy.get("button[name='update']").click();

            // logout of professor account
            cy.visit(url + "/logout");

            // login to student account
            cy.get("input[id='inputEmail']").type(student.email);
            cy.get("input[id='inputPassword']").type(student.password);
            cy.get("button[name='login']").click();

            // view deliverable
            cy.visit(url + "/classes/" + class_._id + "/A1");

            // submit deliverable
            cy.get("input[id='plagiarismCheck']").click();
            cy.get("button[type=submit]").click();
            cy.contains("ERROR: Failed to update submission, A file was not submitted! Please try again.");

            cy.visit(url + "/logout");
        });
        
        it("Tries to submit a Deliverable passed the deadline", () => {
            const student = results[0];
            const class_ = results[3];
            
            // update deliverable deadline
            cy.task("forceUpdateDeadline", { newDeadline: Cypress.moment().format("YYYY-MM-DDTHH:MM"), classId: class_._id, titleParam: "A1" });

            // Visit the Login page.
            cy.visit(url);

            // login to student account
            cy.get("input[id='inputEmail']").type(student.email);
            cy.get("input[id='inputPassword']").type(student.password);
            cy.get("button[name='login']").click();

            // view deliverable
            cy.visit(url + "/classes/" + class_._id + "/A1");

            // submit deliverable
            cy.get("input[id='plagiarismCheck']").click();
            cy.get("input[id='deliverable_file']").attachFile("assignment1.txt");
            cy.get("button[type=submit]").click();
            cy.contains("ERROR: Failed to update submission, You cannot submit past the deadline.");
        })
	});
})