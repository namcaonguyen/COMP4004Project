Feature: A student User can enroll in a Class.

	Scenario: A student User wants to see the Classes to enroll, but there are no available Classes.
		Given There are no existing Users in the database
		And There are no existing Classes in the database
		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password" and courses taken ""
		When Student User tries to view list of available Classes
		Then There are no available Classes

	Scenario Outline: A student User successfully enrolls in a Class.
		Given There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12
		And There are no existing Users in the database
		And There are no existing Courses in the database
		And There are no existing Classes in the database
		And There are no existing ClassEnrollments in the database
		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password" and courses taken <coursesTaken>
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password" and courses taken ""
		And There is a course in the database with code "NAMO1001" and title "How to be Rad" and prereqs <requiredPrereqs> and precludes ""
		And There is a course in the database with code "COMP4004" and title "Software Quality Assurance" and prereqs "" and precludes "TEST1001"
		And There is a course in the database with code "EXCL1001" and title "Top Secret" and prereqs "" and precludes "COMP4004"
		And There is a course in the database with code "TEST1001" and title "Test" and prereqs "" and precludes ""
		And There is a course in the database with code "GUCI1001" and title "All About Gucci" and prereqs "" and precludes ""
		And There is a course in the database with code "GUCI1002" and title "Gucci Alternatives" and prereqs "" and precludes "GUCI1001"
		And There is a course in the database with code "COMP4006" and title "FourThousandSix" and prereqs "" and precludes ""
		And There is a course in the database with code "PREC1001" and title "Precludes FourThousandSix" and prereqs "" and precludes "COMP4006"
		And There is a course in the database with code "COOL1001" and title "Preclude not in Database" and prereqs "" and precludes "GONE1001"
		And There exists a Class for "NAMO1001" taught by professor with email "namo@namo.com" with capacity <totalCapacity>
		When Student User tries to view list of available Classes
		Then There are available Classes
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled
	Examples:
		| coursesTaken					| requiredPrereqs						| totalCapacity	|
		# TEST different capacities.
		| ""							| ""									| 200			|
		| ""							| ""									| 2				|
		| ""							| ""									| 1				|
		# TEST successfully enrolling in a Class with prerequisites, with the required prerequisites.
		| "COMP4004"					| "COMP4004"							| 200			|
		| "COMP4004,EXCL1001"			| "COMP4004,EXCL1001"					| 200			|
		| "EXCL1001,COMP4004"			| "COMP4004,EXCL1001"					| 200			|
		# TEST successfully enrolling in a Class with prerequisites, without the required prerequisites, but a preclude of the prerequisites.
		#	A Course taken precludes the prerequisite.
		| "EXCL1001"					| "COMP4004"							| 200			|
		#	The prerequisite precludes a Course taken.
		| "TEST1001"					| "COMP4004"							| 200			|
		# TEST succesfully enrolling in a Class with a prerequisite, dealing with Courses removed from the database.
		| "GONE1001"					| "GONE1001"							| 200			|
		| "COOL1001"					| "GONE1001"							| 200			|
		| "GONE1001"					| "COOL1001"							| 200			|
		# TEST successfully enrolling in a Class with prerequisites, with some required prerequisites and some precludes.
		| "EXCL1001,GUCI1001,PREC1001"	| "COMP4004,GUCI1001,COMP4006,GUCI1002"	| 200			|
		| "TEST1001,GUCI1001,PREC1001"	| "COMP4004,GUCI1001,COMP4006,GUCI1002"	| 200			|

	Scenario Outline: A student User tries to enroll in a Class that they don't have the prerequisites for. They are unsuccessful.
		Given There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12
		And There are no existing Users in the database
		And There are no existing Courses in the database
		And There are no existing Classes in the database
		And There are no existing ClassEnrollments in the database
		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password" and courses taken <coursesTaken>
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password" and courses taken ""
		And There is a course in the database with code "NAMO1001" and title "How to be Rad" and prereqs <requiredPrereqs> and precludes ""
		And There is a course in the database with code "COMP4004" and title "Software Quality Assurance" and prereqs "" and precludes "TEST1001"
		And There is a course in the database with code "EXCL1001" and title "Top Secret" and prereqs "" and precludes "COMP4004"
		And There is a course in the database with code "TEST1001" and title "Test" and prereqs "" and precludes ""
		And There is a course in the database with code "GUCI1001" and title "All About Gucci" and prereqs "" and precludes ""
		And There is a course in the database with code "GUCI1002" and title "Gucci Alternatives" and prereqs "" and precludes "GUCI1001"
		And There is a course in the database with code "COMP4006" and title "FourThousandSix" and prereqs "" and precludes ""
		And There is a course in the database with code "PREC1001" and title "Precludes FourThousandSix" and prereqs "" and precludes "COMP4006"
		And There exists a Class for "NAMO1001" taught by professor with email "namo@namo.com" with capacity 200
		When Student User tries to view list of available Classes
		Then There are available Classes
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student does not enroll and an error is returned
	Examples:
		| coursesTaken					| requiredPrereqs						|
		| ""							| "COMP4004"							|
		| "COMP4006"					| "COMP4004"							|
		| "COMP4004"					| "COMP4004,COMP4006"					|
		| "PREC1001"					| "COMP4004,COMP4006"					|
		| "COMP4004,GUCI1001"			| "COMP4004,GUCI1001,COMP4006"			|
		| "COMP4004,GUCI1001,GUCI1002"	| "COMP4004,GUCI1001,COMP4006"			|
		| "EXCL1001,GUCI1001"			| "COMP4004,GUCI1001,COMP4006,GUCI1002"	|
		| "EXCL1001,PREC1001"			| "COMP4004,GUCI1001,COMP4006,GUCI1002"	|
		| "GUCI1001,PREC1001"			| "COMP4004,GUCI1001,COMP4006,GUCI1002"	|

	Scenario: A student User tries to enroll in a Class past the Academic Deadline.
		Given There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 2020, month 11, day 16
		And There are no existing Users in the database
		And There are no existing Courses in the database
		And There are no existing Classes in the database
		And There are no existing ClassEnrollments in the database
		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password" and courses taken ""
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password" and courses taken ""
		And There is a course in the database with code "NAMO1001" and title "How to be Rad" and prereqs "" and precludes ""
		And There exists a Class for "NAMO1001" taught by professor with email "namo@namo.com" with capacity 150
		When Student User tries to view list of available Classes
		Then There are available Classes
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student does not enroll and an error is returned

	Scenario: A student User tries to enroll in a Class that they are already enrolled in.
		Given There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12
		And There are no existing Users in the database
		And There are no existing Courses in the database
		And There are no existing Classes in the database
		And There are no existing ClassEnrollments in the database
		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password" and courses taken ""
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password" and courses taken ""
		And There is a course in the database with code "NAMO1001" and title "How to be Rad" and prereqs "" and precludes ""
		And There exists a Class for "NAMO1001" taught by professor with email "namo@namo.com" with capacity 150
		When Student User tries to view list of available Classes
		Then There are available Classes
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student does not enroll and an error is returned

	Scenario: A student User tries to enroll in a Class that is already full.
		Given There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12
		And There are no existing Users in the database
		And There are no existing Courses in the database
		And There are no existing Classes in the database
		And There are no existing ClassEnrollments in the database
		And There exists a "student" "Fast McGee" with email "fast@guy.com" and password "TheSpeedySpeedster99" and courses taken ""
		And There exists a "student" "Slowy Slowerson" with email "slow@guy.com" and password "password" and courses taken ""
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password" and courses taken ""
		And There is a course in the database with code "NAMO1001" and title "How to be Rad" and prereqs "" and precludes ""
		And There exists a Class for "NAMO1001" taught by professor with email "namo@namo.com" with capacity 1
		When Student User tries to view list of available Classes
		Then There are available Classes
		And Student with email "fast@guy.com" wants to enroll in the Class
		And Student is successfully enrolled
		And Student with email "slow@guy.com" wants to enroll in the Class
		And Student does not enroll and an error is returned

	Scenario: A student User tries to enroll in a Class. But an administrator User cancelled the Class before the student could enroll.
		Given There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12
		And There are no existing Users in the database
		And There are no existing Courses in the database
		And There are no existing Classes in the database
		And There are no existing ClassEnrollments in the database
		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password" and courses taken ""
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password" and courses taken ""
		And There is a course in the database with code "NAMO1001" and title "How to be Rad" and prereqs "" and precludes ""
		And There exists a Class for "NAMO1001" taught by professor with email "namo@namo.com" with capacity 150
		When Student User tries to view list of available Classes
		Then There are available Classes
		# Delete all the Classes right before the student User decides to enroll.
		And There are no existing Classes in the database
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student does not enroll and an error is returned