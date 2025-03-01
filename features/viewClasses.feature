Feature: View Assigned and Enrolled Classes

@professorViewClasses
	Scenario Outline: A professor views their classes
		Given The database is empty
		And There is a course in the database with code "COMP4004" and title "Software Quality Assurance" before viewing all classes
		And There exists a "professor" "Jean-Pierre Corriveau" with email "jp@cms.com" and password "password" and courses taken ""
		When There exists a class for course code "COMP4004" with "Jean-Pierre Corriveau" <capacity> <prereqs> <precluded> before viewing all classes
		Then "Jean-Pierre Corriveau" can see the class in the view classes list
	Examples:
		Examples:
		| capacity          | prereqs	| precluded	|
		| 150				| ""		| ""		|

@professorViewNoClasses
	Scenario Outline: A professor views their classes but there aren't any found
		Given The database is empty
		And There is a course in the database with code "COMP4004" and title "Software Quality Assurance" before viewing all classes
		When There exists a "professor" "Jean-Pierre Corriveau" with email "jp@cms.com" and password "password" and courses taken ""
		Then "Jean-Pierre Corriveau" cannot see the class in the view classes list
	Examples:
		Examples:
		| capacity          | prereqs	| precluded	|
		| 150				| ""		| ""		|

@studentViewClasses
	Scenario Outline: A student views their classes
		Given The database is empty
		And There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 1, day 1
		And There is a course in the database with code "COMP4004" and title "Software Quality Assurance" before viewing all classes
		And There exists a "professor" "Jean-Pierre Corriveau" with email "jp@cms.com" and password "password" and courses taken ""
		And There exists a class for course code "COMP4004" with "Jean-Pierre Corriveau" <capacity> <prereqs> <precluded> before viewing all classes
		When There exists a "student" "Zahid Dawod" with email "zahid_dawod@cms.com" and password "password" and courses taken ""
		And "Zahid Dawod" enrolls in "COMP4004"
		Then "Zahid Dawod" can see the class in the view classes list
	Examples:
		Examples:
		| capacity          | prereqs	| precluded	|
		| 150				| ""		| ""		|

@studentViewNoClasses
	Scenario Outline: A student views their classes but there aren't any found
		Given The database is empty
		And There is a course in the database with code "COMP4004" and title "Software Quality Assurance" before viewing all classes
		When There exists a "student" "Zahid Dawod" with email "zahid_dawod@cms.com" and password "password" and courses taken ""
		Then "Zahid Dawod" cannot see the class in the view classes list
	Examples:
		Examples:
		| capacity          | prereqs	| precluded	|
		| 150				| ""		| ""		|