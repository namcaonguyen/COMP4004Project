Feature: Create Course
        
	Scenario Outline: An admin creates a course
        Given There are no courses in the database
		When A course is created with code <courseCode> and title <courseTitle>
		Then There exists a course with code <courseCode> and title <courseTitle>
    
    Examples:
		| courseCode | courseTitle                      |
		| "COMP4004" | "Software Quality Assurance"     |
		| "BUSI2301" | "Intro to Operations Management" |
		| "COMP4109" | "Applied Cryptograph"            |