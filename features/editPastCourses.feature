Feature: An student User can edit which Courses they've taken in the past. This is how we will check if prerequisites have been taken.

	Scenario Outline: A student User tries editing their past Courses. The coursesTaken attribute of the student User should be updated.
		Given There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12
		And There are no existing Users in the database
		And There exists a "student" "Johnson Joe" with email "johnson@joe.com" and password "reallygoodpassword" and courses taken <currentCoursesTaken>
		When The student with email "johnson@joe.com" tries to edit their past Courses to remove <coursesToRemove>, and add <coursesToAdd>
		Then The student with email "johnson@joe.com" successfully had their Courses Taken attribute updated to <updatedCourses>
	Examples:
		| currentCoursesTaken			| coursesToRemove				| coursesToAdd			| updatedCourses		|
		# Change nothing.
		| ""							| ""							| ""					| ""					|
		| "COMP4004"					| ""							| ""					| "COMP4004"			|
		# Remove one course.
		| "COMP4004"					| "COMP4004"					| ""					| ""					|
		| "COMP4004,NAMO1001"			| "COMP4004"					| ""					| "NAMO1001"			|
		# Remove multiple courses.
		| "COMP4004,NAMO1001,TEST1001"	| "COMP4004,TEST1001"			| ""					| "NAMO1001"			|
		| "COMP4004,NAMO1001,TEST1001"	| "COMP4004,TEST1001,NAMO1001"	| ""					| ""					|
		# Add one Course.
		| ""							| ""							| "COMP4004"			| "COMP4004"			|
		| "COMP4004"					| ""							| "NAMO1001"			| "COMP4004,NAMO1001"	|
		# Add multiple Courses.
		| ""							| ""							| "COMP4004,NAMO1001"	| "COMP4004,NAMO1001"	|
		# Add and remove Courses.
		| "COMP4004"					| "COMP4004"					| "NAMO1001"			| "NAMO1001"			|

	Scenario: A student User tries editing their past Courses. But the student is deleted before they can update their Courses.
		Given There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12
		And There are no existing Users in the database
		And There exists a "student" "Johnson Joe" with email "johnson@joe.com" and password "reallygoodpassword" and courses taken ""
		And There are no existing Users in the database
		When The student with email "johnson@joe.com" tries to edit their past Courses to remove "", and add ""
		Then The student information is not updated