Feature: View Assigned Professor Classes

	Scenario Outline: A professor views their classes
		Given There are no existing classes in the database before viewing all professor classes
		And there are no courses in the database before viewing all professor classes
		And There is a course in the database with code "COMP4004" and title "Software Quality Assurance" before viewing all professor classes
		And there are no professors in the database before viewing all professor classes
		And there exists an approved professor in the database named "Jean-Pierre Corriveau" with email "jp@gmail.com" and password "password" before viewing all professor classes
		When there exists a class for course code "COMP4004" with "Jean-Pierre Corriveau" <capacity> <prereqs> <precluded> before viewing all professor classes
		Then "Jean-Pierre Corriveau" can see the class in the view classes list

	Examples:
		Examples:
		| capacity          | prereqs	| precluded	|
		| 150				| ""		| ""		|

	Scenario Outline: A professor views their classes but there aren't any found
		Given There are no existing classes in the database before viewing all professor classes
		And there are no courses in the database before viewing all professor classes
		And There is a course in the database with code "COMP4004" and title "Software Quality Assurance" before viewing all professor classes
		And there are no professors in the database before viewing all professor classes
		When there exists an approved professor in the database named "Jean-Pierre Corriveau" with email "jp@cms.com" and password "password" before viewing all professor classes
		Then "Jean-Pierre Corriveau" cannot see the class in the view classes list

	Examples:
		Examples:
		| capacity          | prereqs	| precluded	|
		| 150				| ""		| ""		|