Feature: Create Course
        
	Scenario Outline: An admin creates a course
        Given There are no courses in the database
		When An admin tries to create a course with code <courseCode> and title <courseTitle> and prereqs <prereqs> and precludes <precludes>
        Then A new course is successfully created
		And There exists a course with code <courseCode> and title <courseTitle> and prereqs <prereqs> and precludes <precludes>
    
    Examples:
		| courseCode | courseTitle                      | prereqs				| precludes				|
		| "COMP4004" | "Software Quality Assurance"     | "TEST1001,TEST1002"	| "TEST1003"			|
		| "BUSI2301" | "Intro to Operations Management" | ""					| ""					|
		| "COMP4109" | "Applied Cryptograph"            | "TEST1001"			| "TEST1002,TEST1003"	|
    
    Scenario Outline: An admin fails to create a course due to a malformed entry
        Given There are no courses in the database
		When An admin tries to create a course with code <courseCode> and title <courseTitle> and prereqs <prereqs> and precludes <precludes>
        Then No new course is created and an error is returned
		And There does not exist a course with code <courseCode> and title <courseTitle>
    
    Examples:
		| courseCode | courseTitle                      | prereqs		| precludes		|
		| "COMP4004" | ""                               | "TEST1001"	| "TEST1002"	|
		| "BUSI230"  | "Intro to Operations Management" | "TEST1001"	| "TEST1002"	|
		| "4109COMP" | "Applied Cryptograph"            | "TEST1001"	| "TEST1002"	|
		| "comp1234" | "Applied Cryptograph"            | "TEST1001"	| "TEST1002"	|
    
    Scenario Outline: An admin fails to create a course due to duplicate course code
        Given There are no courses in the database
		When An admin tries to create a course with code <courseCode> and title <courseTitle> and prereqs "" and precludes ""
        And A new course is successfully created
		And There exists a course with code <courseCode> and title <courseTitle> and prereqs "" and precludes ""
		And An admin tries to create a course with code <courseCode> and title <courseTitle2> and prereqs "" and precludes ""
        Then No new course is created and an error is returned
		And There exists a course with code <courseCode> and title <courseTitle> and prereqs "" and precludes ""
    
    Examples:
		| courseCode | courseTitle                      | courseTitle2                     |
		| "COMP4004" | "Software Quality Assurance"     | "Software Quality Assurance"     |
		| "BUSI2301" | "Intro to Operations Management" | "Accounting"                     |