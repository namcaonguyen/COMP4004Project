Feature: Professor Update and Delete Deliverable

@test53X
	Scenario: A professor updates a deliverable title and description
		Given A professor creates a deliverable with info "A1" "This is your third assignment" 20
		When The professor updates the deliverable "title" to "Assignment 1"
		And The professor updates the deliverable "description" to "This is your second assignment"
		Then The deliverable "title" should now be "Assignment 1"
        And The deliverable "description" should now be "This is your second assignment"
        And The deliverable weight should still be 20

@test53
	Scenario: A professor deletes a deliverable
		Given A professor creates a deliverable with info "Assignment 1" "This is your first assignment" 20
		And The professor deletes that deliverable
		Then The deliverable should not exist anymore in the database

@test54a
	Scenario: A professor tries to delete a deliverable that does not exist anymore
		Given A professor creates a deliverable with info "Assignment 1" "This is your first assignment" 20
		And The professor deletes that deliverable
		And The professor tries to delete that deliverable again
		Then The result is a unsuccessful delete attempt

@test54b
	Scenario: A professor tries to delete a deliverable which has submissions
		Given A professor creates a deliverable with info "Assignment 1" "This is your first assignment" 20
		And There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 11, day 15
		And There exists an approved student with name "Zahid Dawod" email "zahid.dawod@cms.com" and password "password"
		And "Zahid Dawod" submits a text file named "a1.txt" as submission to that deliverable with the contents being "Hi this is my submission"
		And The professor tries to delete that deliverable
		Then The result is a unsuccessful delete attempt

@test55
	Scenario: A professor tries to delete a deliverable but the class its for doesn't exist anymore
		Given A professor creates a deliverable with info "Assignment 1" "This is your first assignment" 20
		When An administrator deletes the class
		And The professor tries to delete that deliverable
		Then The result is a unsuccessful delete attempt

@test56
	Scenario: A professor tries to delete a Deliverable for a Class, but an admin reassigned the Class to a different professor.
		Given A professor creates a deliverable with info "Assignment 1" "This is your first assignment" 20
		And There exists a "professor" "NamCao Nguyen" with email "nogood@okay.com" and password "spaghetti" and courses taken ""
		When An admin reassigns the Class to professor with email "nogood@okay.com"
		And The professor tries to delete that deliverable
		Then The result is a unsuccessful delete attempt