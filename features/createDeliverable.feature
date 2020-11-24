Feature: Create a deliverable for a class

	Scenario Outline: A professor creates a deliverable for a class with valid input
		Given The database is empty before creating a deliverable
		When There exists an approved professor with name "JP Corriveau" email "jp@cms.com" and password "password"
		And There exists a course with course code "COMP4004" and title "Quality Assurance"
		And There exists a class for COMP4004 with JP as the professor and class capacity of <capacity>
		When JP tries to create a deliverable for COMP4004 with <title> <description> and <weight>
		Then There exists a deliverable for the class with <title> <description> and <weight>

	Examples:
		| title			 | description														  | weight  | capacity  |
		| "Assignment 1" | "1. Make a scenario graph for creating a deliverable. (312 marks)" | 10		| 200	    |
		| "Assignment 2" | "2. Make a scenario graph for creating a class. (312 marks)"		  | 0		| 200	    |
		| "Assignment 3" | "3. Make a scenario graph for creating a course. (312 marks)"	  | 100		| 200	    |

	Scenario Outline: A professor tries to create a deliverable for a class with invalid input
        Given The database is empty before creating a deliverable
		When There exists an approved professor with name "JP Corriveau" email "jp@cms.com" and password "password"
		And There exists a course with course code "COMP4004" and title "Quality Assurance"
		And There exists a class for COMP4004 with JP as the professor and class capacity of <capacity>
		When JP tries to create a deliverable for COMP4004 with <title> <description> and <weight>
		Then The deliverable does not exist in the database

	Examples:
		| title			 | description														  | weight  | capacity  |
		| "Assignment 1" | "1. Make a scenario graph for creating a deliverable. (312 marks)" | -1		| 200	    |
		| "Assignment 2" | "2. Make a scenario graph for creating a class. (312 marks)"		  | 101		| 200	    |

	Scenario Outline: A professor tries to create a deliverable for a class but the class was deleted before creating the deliverable
        Given The database is empty before creating a deliverable
		When There exists an approved professor with name "JP Corriveau" email "jp@cms.com" and password "password"
		And There exists a course with course code "COMP4004" and title "Quality Assurance"
		And There exists a class for COMP4004 with JP as the professor and class capacity of <capacity>
		And The class was deleted
		When JP tries to create a deliverable for COMP4004 with <title> <description> and <weight>
		Then The deliverable does not exist in the database

	Examples:
		| title			 | description														  | weight  | capacity  |
		| "Assignment 1" | "1. Make a scenario graph for creating a deliverable. (312 marks)" | 10		| 200	    |