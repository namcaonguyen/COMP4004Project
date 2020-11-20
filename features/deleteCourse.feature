Feature: Create Course
        
	Scenario Outline: An admin creates and deletes a course, then it doesn't exist
        Given There are no courses in the database
		And An admin tries to create a course with code <courseCode> and title <courseTitle> and prereqs "" and precludes ""
        And A new course is successfully created
		And There exists a course with code <courseCode> and title <courseTitle> and prereqs "" and precludes ""
		When An admin deletes a course with code <courseCode>
		Then There does not exist a course with code <courseCode> and title <courseTitle>
    
    Examples:
		| courseCode | courseTitle                      |
		| "COMP4004" | "Software Quality Assurance"     |
		| "BUSI2301" | "Intro to Operations Management" |
		| "COMP4109" | "Applied Cryptograph"            |
        
	Scenario: An admin creates and deletes a course, and the classes are removed too
        Given There are no existing classes in the database
		And there are no courses in the database
		And There are no existing ClassEnrollments in the database
		And There is a course in the database with code "COMP4004" and title "Software Quality Assurance" and prereqs "" and precludes ""
		And there are no professors in the database
		And there exists an approved professor in the database named "Jean-Pierre Corriveau" with email "jp@gmail.com" and password "password"
		And An admin tries to create a class for course code "COMP4004" with "Jean-Pierre Corriveau" and capacity 150
		And There exists a class for the "COMP4004" with "Jean-Pierre Corriveau" and capacity 150
		When An admin deletes a course with code "COMP4004"
		Then There does not exist a course with code "COMP4004" and title "Software Quality Assurance"
		And The number of classes in the database is 0