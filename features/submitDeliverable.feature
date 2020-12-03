Feature: Submit Deliverable

	Scenario: A student successfully submits submits their deliverable
		Given A professor creates a deliverable for a class "without" a deadline
		When There exists an approved student with name "Zahid Dawod" email "zahid.dawod@cms.com" and password "password"
		And "Zahid Dawod" submits a text file named "a1.txt" as submission to that deliverable with the contents being "Hi this is my submission"
		Then There exists a deliverable submission in the DB for "Zahid Dawod" in the first deliverable for that class

	Scenario: A student tries to submit after the deadline
		Given A professor creates a deliverable for a class "with" a deadline
		When There exists an approved student with name "Zahid Dawod" email "zahid.dawod@cms.com" and password "password"
		And The student waits until its past the deadline
		And "Zahid Dawod" submits a text file named "a1.txt" as submission to that deliverable with the contents being "Hi this is my submission"
		Then The submission should not exist