Feature: Professor Update and Delete Deliverable

	Scenario: A professor updates a deliverable title and description
		Given A professor creates a deliverable with info "A1" "This is your third assignment" 20
		When The professor updates the deliverable "title" to "Assignment 1"
		And The professor updates the deliverable "description" to "This is your second assignment"
		Then The deliverable "title" should now be "Assignment 1"
        And The deliverable "description" should now be "This is your second assignment"
        And The deliverable weight should still be 20

	Scenario: A professor deletes a deliverable
		Given A professor creates a deliverable with info "Assignment 1" "This is your first assignment" 20
		And The professor deletes that deliverable
		Then The deliverable should not exist anymore in the database