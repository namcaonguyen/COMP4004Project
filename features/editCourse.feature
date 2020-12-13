Feature: An administrator User can edit the information of a Course.

@editCourse
	Scenario Outline: An administrator User tries editing the Course information (which includes title, prerequisites, and precludes). The Course information should be updated.
		Given There are no existing Courses in the database
		And There is a course in the database with code "COMP4004" and title "Software Quality Assurance" and prereqs "" and precludes ""
		And There is a course in the database with code "NAMO1001" and title "How to be Rad" and prereqs "" and precludes ""
		And There is a course in the database with code "TEST1001" and title "Tester Course" and prereqs "" and precludes ""
		And There is a course in the database with code "EXCL1001" and title "Top Secret" and prereqs <prerequisites> and precludes <precludes>
		When The admin tries to change "EXCL1001" title to <titleToChange>, and remove <prereqsToRemove> and <precludesToRemove>, and add <prereqsToAdd> and <precludesToAdd>
		Then The "EXCL1001" Course had its information successfully changed to title <titleToChange> and prerequisites <updatedPrereqs> and precludes <updatedPrecludes>
	Examples:
		| prerequisites					| precludes						| titleToChange	| prereqsToRemove				| prereqsToAdd			| precludesToRemove				| precludesToAdd		| updatedPrereqs		| updatedPrecludes		|
		# Change nothing.
		| ""							| ""							| "Top Secet"	| ""							| ""					| ""							| ""					| ""					| ""					|
		| "COMP4004"					| ""							| "Top Secret"	| ""							| ""					| ""							| ""					| "COMP4004"			| ""					|
		# Change the title.
		| ""							| ""							| "Changed"		| ""							| ""					| ""							| ""					| ""					| ""					|
		# Remove one prerequisite.
		| "COMP4004"					| ""							| "Top Secret"	| "COMP4004"					| ""					| ""							| ""					| ""					| ""					|
		| "COMP4004,NAMO1001"			| ""							| "Top Secret"	| "COMP4004"					| ""					| ""							| ""					| "NAMO1001"			| ""					|
		# Remove multiple prerequisites.
		| "COMP4004,NAMO1001,TEST1001"	| ""							| "Top Secret"	| "COMP4004,TEST1001"			| ""					| ""							| ""					| "NAMO1001"			| ""					|
		| "COMP4004,NAMO1001,TEST1001"	| ""							| "Top Secret"	| "COMP4004,TEST1001,NAMO1001"	| ""					| ""							| ""					| ""					| ""					|
		# Remove one preclude.
		| ""							| "COMP4004"					| "Top Secret"	| ""							| ""					| "COMP4004"					| ""					| ""					| ""					|
		| ""							| "COMP4004,NAMO1001"			| "Top Secret"	| ""							| ""					| "COMP4004"					| ""					| ""					| "NAMO1001"			|
		# Remove multiple precludes.
		| ""							| "COMP4004,NAMO1001,TEST1001"	| "Top Secret"	| ""							| ""					| "COMP4004,TEST1001"			| ""					| ""					| "NAMO1001"			|
		| ""							| "COMP4004,NAMO1001,TEST1001"	| "Top Secret"	| ""							| ""					| "COMP4004,TEST1001,NAMO1001"	| ""					| ""					| ""					|
		# Add one prerequisite.
		| ""							| ""							| "Top Secret"	| ""							| "COMP4004"			| ""							| ""					| "COMP4004"			| ""					|
		| "COMP4004"					| ""							| "Top Secret"	| ""							| "NAMO1001"			| ""							| ""					| "COMP4004,NAMO1001"	| ""					|
		# Add multiple prerequisites.
		| ""							| ""							| "Top Secret"	| ""							| "COMP4004,NAMO1001"	| ""							| ""					| "COMP4004,NAMO1001"	| ""					|
		# Add one preclude.
		| ""							| ""							| "Top Secret"	| ""							| ""					| ""							| "COMP4004"			| ""					| "COMP4004"			|
		| ""							| "COMP4004"					| "Top Secret"	| ""							| ""					| ""							| "NAMO1001"			| ""					| "COMP4004,NAMO1001"	|
		# Add multiple precludes.
		| ""							| ""							| "Top Secret"	| ""							| ""					| ""							| "NAMO1001,COMP4004"	| ""					| "NAMO1001,COMP4004"	|
		# Add and remove prerequisites and precludes.
		| "COMP4004"					| "NAMO1001"					| "Top Secret"	| "COMP4004"					| "TEST1001"			| "NAMO1001"					| "COMP4004"			| "TEST1001"			| "COMP4004"			|

@tryEditCourseInvalidInputs
	Scenario Outline: An administrator User tries editing the Course information, but the inputs are invalid.
		Given There are no existing Courses in the database
		And There is a course in the database with code "COMP4004" and title "Software Quality Assurance" and prereqs "" and precludes ""
		And There is a course in the database with code "NAMO1001" and title "How to be Rad" and prereqs "" and precludes ""
		And There is a course in the database with code "TEST1001" and title "Tester Course" and prereqs "" and precludes ""
		And There is a course in the database with code "EXCL1001" and title "Top Secret" and prereqs "" and precludes ""
		When The admin tries to change "EXCL1001" title to <titleToChange>, and remove "" and "", and add "" and ""
		Then The Course information is not updated
	Examples:
		| titleToChange	|
		| ""			|