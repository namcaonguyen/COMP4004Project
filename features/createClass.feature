Feature: Create a class for a course
        
	Scenario Outline: An admin creates a class for a course
        Given There are no existing classes in the database
		And there are no courses in the database
		And There is a course in the database with code "COMP4004" and title "Software Quality Assurance" and prereqs <prereqs> and precludes <precluded>
		And there are no professors in the database
		And there exists an approved professor in the database named "Jean-Pierre Corriveau" with email "jp@gmail.com" and password "password"
		When An admin tries to create a class for course code "COMP4004" with "Jean-Pierre Corriveau" and capacity <capacity>
		Then There exists a class for the "COMP4004" with "Jean-Pierre Corriveau" and capacity <capacity>
    
    Examples:
		| capacity          | prereqs			  | precluded	|
		| 150				| "COMP3004,COMP3005" | "COMP2222"	|
		| 150				| ""				  | ""			|

	Scenario Outline: An admin tries to create a class for a course with invalid input
        Given There are no existing classes in the database
		And there are no courses in the database
		And There is a course in the database with code "COMP4004" and title "Software Quality Assurance" and prereqs <prereqs> and precludes <precluded>
		And there are no professors in the database
		And there exists an approved professor in the database named "Jean-Pierre Corriveau" with email "jp@gmail.com" and password "password"
		When An admin tries to create a class for course code "COMP4004" with "Jean-Pierre Corriveau" and capacity <capacity>
		Then class is not found in the database

	Examples:
		| capacity		        | prereqs			  | precluded	|
		| -5					| "COMP3004,COMP3005" | "COMP2222"	|

	Scenario: An admin tries to create a class for a course but the course was deleted before the class was created
		Given There are no existing classes in the database
		And there are no courses in the database
		And There is a course in the database with code "COMP4004" and title "Software Quality Assurance" and prereqs "" and precludes ""
		And there are no professors in the database
		And there exists an approved professor in the database named "Jean-Pierre Corriveau" with email "jp@gmail.com" and password "password"
		And the course was deleted
		When An admin tries to create a class for course code "COMP4004" with "Jean-Pierre Corriveau" and capacity 99
		Then class is not found in the database

	Scenario: An admin tries to create a class for a course but the prof selected was deleted before the class was created
		Given There are no existing classes in the database
		And there are no courses in the database
		And There is a course in the database with code "COMP4004" and title "Software Quality Assurance" and prereqs "" and precludes ""
		And there are no professors in the database
		And there exists an approved professor in the database named "Jean-Pierre Corriveau" with email "jp@gmail.com" and password "password"
		And the prof was deleted
		When An admin tries to create a class for course code "COMP4004" with "Jean-Pierre Corriveau" and capacity 99
		Then the prof is not found in the database