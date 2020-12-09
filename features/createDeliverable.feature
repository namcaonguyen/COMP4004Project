Feature: Create a deliverable for a class

@test49
	Scenario Outline: A professor creates a deliverable for a class with valid input
		Given The database is empty before creating a deliverable
		When There exists a "professor" "JP Corriveau" with email "jp@cms.com" and password "password" and courses taken ""
		And There exists a course with course code "COMP4004" and title "Quality Assurance"
		And There exists a class for COMP4004 with "jp@cms.com" as the professor and class capacity of <capacity>
		When Professor with email "jp@cms.com" tries to create a deliverable for COMP4004 with <title> <description> and <weight>
		Then There exists a deliverable for the class with <title> <description> and <weight>
	Examples:
		| title			 | description														  | weight  | capacity  |
		| "Assignment 1" | "1. Make a scenario graph for creating a deliverable. (312 marks)" | 10		| 200	    |
		| "Assignment 2" | "2. Make a scenario graph for creating a class. (312 marks)"		  | 0		| 200	    |
		| "Assignment 3" | "3. Make a scenario graph for creating a course. (312 marks)"	  | 100		| 200	    |

@test49X
	Scenario Outline: A professor tries to create a deliverable for a class with invalid input
        Given The database is empty before creating a deliverable
		When There exists a "professor" "JP Corriveau" with email "jp@cms.com" and password "password" and courses taken ""
		And There exists a course with course code "COMP4004" and title "Quality Assurance"
		And There exists a class for COMP4004 with "jp@cms.com" as the professor and class capacity of <capacity>
		When Professor with email "jp@cms.com" tries to create a deliverable for COMP4004 with <title> <description> and <weight>
		Then The deliverable does not exist in the database
	Examples:
		| title			 | description														  | weight  | capacity  |
		| "Assignment 1" | "1. Make a scenario graph for creating a deliverable. (312 marks)" | -1		| 200	    |
		| "Assignment 2" | "2. Make a scenario graph for creating a class. (312 marks)"		  | 101		| 200	    |

@test51
	Scenario Outline: A professor tries to create a deliverable for a class but the class was deleted before creating the deliverable
        Given The database is empty before creating a deliverable
		When There exists a "professor" "JP Corriveau" with email "jp@cms.com" and password "password" and courses taken ""
		And There exists a course with course code "COMP4004" and title "Quality Assurance"
		And There exists a class for COMP4004 with "jp@cms.com" as the professor and class capacity of <capacity>
		And The class was deleted
		When Professor with email "jp@cms.com" tries to create a deliverable for COMP4004 with <title> <description> and <weight>
		Then The deliverable does not exist in the database
	Examples:
		| title			 | description														  | weight  | capacity  |
		| "Assignment 1" | "1. Make a scenario graph for creating a deliverable. (312 marks)" | 10		| 200	    |

@test52
	Scenario: A professor tries to create a deliverable for a class, but an admin reassigned the Class to a different professor.
		Given The database is empty before creating a deliverable
		When There exists a "professor" "JP Corriveau" with email "jp@cms.com" and password "password" and courses taken ""
		And There exists a "professor" "NamCao Nguyen" with email "nogood@okay.com" and password "spaghetti" and courses taken ""
		And There exists a course with course code "COMP4004" and title "Quality Assurance"
		And There exists a class for COMP4004 with "jp@cms.com" as the professor and class capacity of 50
		And An administrator tries reassign the class to professor with email "nogood@okay.com"
		And Professor with email "jp@cms.com" tries to create a deliverable for COMP4004 with "Assignment 1" "Do something super!" and 70
		Then The deliverable does not exist in the database

@test50
	Scenario: A professor tries to create a Deliverable with the same title as an existing Deliverable.
		Given The database is empty before creating a deliverable
		When There exists a "professor" "JP Corriveau" with email "jp@cms.com" and password "password" and courses taken ""
		And There exists a course with course code "COMP4004" and title "Quality Assurance"
		And There exists a class for COMP4004 with "jp@cms.com" as the professor and class capacity of 50
		When Professor with email "jp@cms.com" tries to create a deliverable for COMP4004 with "Assignment 1" "Do something super!" and 71
		And There exists a deliverable for the class with "Assignment 1" "Do something super!" and 71
		And Professor with email "jp@cms.com" tries to create a deliverable for COMP4004 with "Assignment 1" "Do something super again!" and 71
		Then The deliverable does not exist in the database