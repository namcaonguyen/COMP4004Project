// Cypress Test for Account Registration.
describe("Account Registration", function() {
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
})