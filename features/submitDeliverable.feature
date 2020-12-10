Feature: Submit Deliverable

@test42
	Scenario: A student successfully submits submits their deliverable
		Given A professor "Jean-Pierre Corriveau" creates a deliverable for a class "COMP1405" "without" a deadline
		When There exists an approved student with name "Zahid Dawod" email "zahid.dawod@cms.com" and password "password"
		And "Zahid Dawod" submits a text file named "a1.txt" as submission to that deliverable with the contents being "Hi this is my submission"
		Then There exists a deliverable submission in the DB for "Zahid Dawod" in the first deliverable for that class

@test46
	Scenario: A student tries to submit after the deadline
		Given A professor "Jean-Pierre Corriveau" creates a deliverable for a class "COMP1405" "with" a deadline
		When There exists an approved student with name "Zahid Dawod" email "zahid.dawod@cms.com" and password "password"
		And The student waits until its past the deadline
		And "Zahid Dawod" submits a text file named "a1.txt" as submission to that deliverable with the contents being "Hi this is my submission"
		Then The submission should not exist

@test43
	Scenario: A student tries to submit, but an administrator cancelled the Class.
		Given A professor "Jean-Pierre Corriveau" creates a deliverable for a class "COMP1405" "without" a deadline
		When There exists an approved student with name "Zahid Dawod" email "zahid.dawod@cms.com" and password "password"
		And An Admin deletes a class for course code "COMP1405" with "Jean-Pierre Corriveau"
		And "Zahid Dawod" submits a text file named "a1.txt" as submission to that deliverable with the contents being "Hi this is my submission"
		Then The submission should not exist

@test44
	Scenario: A student tries to submit, but they had already dropped the Class.
		Given There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 1, day 1
		And A professor "Jean-Pierre Corriveau" creates a deliverable for a class "COMP1405" "without" a deadline
		When There exists an approved student with name "Zahid Dawod" email "zahid.dawod@cms.com" and password "password"
		And "Zahid Dawod" drops the Class
		And "Zahid Dawod" submits a text file named "a1.txt" as submission to that deliverable with the contents being "Hi this is my submission"
		Then The submission should not exist

@test45
	Scenario: A student tries to submit, but the Deliverable does not exist anymore.
		Given There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 1, day 1
		And A professor "Jean-Pierre Corriveau" creates a deliverable for a class "COMP1405" "without" a deadline
		When There exists an approved student with name "Zahid Dawod" email "zahid.dawod@cms.com" and password "password"
		And The professor deletes the Deliverable, after student submits a text file named "a1.txt" as submission with contents "Hi this is my submission"
		Then The submission should not exist