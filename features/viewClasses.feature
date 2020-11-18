Feature: View Assigned and Enrolled Classes

	Scenario Outline: A professor views their classes
		Given The database is empty
		And There is a course in the database with code "COMP4004" and title "Software Quality Assurance" before viewing all classes
		And There exists an approved "professor" in the database named "Jean-Pierre Corriveau" with email "jp@cms.com" and password "password" before viewing all classes
		When There exists a class for course code "COMP4004" with "Jean-Pierre Corriveau" <capacity> <prereqs> <precluded> before viewing all classes
		Then "Jean-Pierre Corriveau" can see the class in the view classes list
	Examples:
		Examples:
		| capacity          | prereqs	| precluded	|
		| 150				| ""		| ""		|

	Scenario Outline: A professor views their classes but there aren't any found
		Given The database is empty
		And There is a course in the database with code "COMP4004" and title "Software Quality Assurance" before viewing all classes
		When There exists an approved "professor" in the database named "Jean-Pierre Corriveau" with email "jp@cms.com" and password "password" before viewing all classes
		Then "Jean-Pierre Corriveau" cannot see the class in the view classes list
	Examples:
		Examples:
		| capacity          | prereqs	| precluded	|
		| 150				| ""		| ""		|

	Scenario Outline: A student views their classes
		Given The database is empty
		And There is a course in the database with code "COMP4004" and title "Software Quality Assurance" before viewing all classes
		And There exists an approved "professor" in the database named "Jean-Pierre Corriveau" with email "jp@cms.com" and password "password" before viewing all classes
		And There exists a class for course code "COMP4004" with "Jean-Pierre Corriveau" <capacity> <prereqs> <precluded> before viewing all classes
		When There exists an approved "student" in the database named "Zahid Dawod" with email "zahid_dawod@cms.com" and password "password" before viewing all classes
		And "Zahid Dawod" enrolls in "COMP4004"
		Then "Zahid Dawod" can see the class in the view classes list
	Examples:
		Examples:
		| capacity          | prereqs	| precluded	|
		| 150				| ""		| ""		|

	Scenario Outline: A student views their classes but there aren't any found
		Given The database is empty
		And There is a course in the database with code "COMP4004" and title "Software Quality Assurance" before viewing all classes
		When There exists an approved "student" in the database named "Zahid Dawod" with email "zahid_dawod@cms.com" and password "password" before viewing all classes
		Then "Zahid Dawod" cannot see the class in the view classes list
	Examples:
		Examples:
		| capacity          | prereqs	| precluded	|
		| 150				| ""		| ""		|