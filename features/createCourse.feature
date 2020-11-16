Feature: Create Course
        
	Scenario Outline: An admin creates a course
        Given There are no courses in the database
		When An admin tries to create a course with code <courseCode> and title <courseTitle>
        Then A new course is successfully created
		And There exists a course with code <courseCode> and title <courseTitle>
    
    Examples:
		| courseCode | courseTitle                      |
		| "COMP4004" | "Software Quality Assurance"     |
		| "BUSI2301" | "Intro to Operations Management" |
		| "COMP4109" | "Applied Cryptograph"            |
    
    Scenario Outline: An admin fails to create a course due to a malformed entry
        Given There are no courses in the database
		When An admin tries to create a course with code <courseCode> and title <courseTitle>
        Then No new course is created and an error is returned
		And There does not exist a course with code <courseCode> and title <courseTitle>
    
    Examples:
		| courseCode | courseTitle                      |
		| "COMP4004" | ""                               |
		| "BUSI230"  | "Intro to Operations Management" |
		| "4109COMP" | "Applied Cryptograph"            |
		| "comp1234" | "Applied Cryptograph"            |
    
    Scenario Outline: An admin fails to create a course due to duplicate course code
        Given There are no courses in the database
		When An admin tries to create a course with code <courseCode> and title <courseTitle>
        And A new course is successfully created
		And There exists a course with code <courseCode> and title <courseTitle>
		And An admin tries to create a course with code <courseCode> and title <courseTitle2>
        Then No new course is created and an error is returned
		And There exists a course with code <courseCode> and title <courseTitle>
    
    Examples:
		| courseCode | courseTitle                      | courseTitle2                     |
		| "COMP4004" | "Software Quality Assurance"     | "Software Quality Assurance"     |
		| "BUSI2301" | "Intro to Operations Management" | "Accounting"                     |