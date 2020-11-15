Feature: A student User can enroll in a Class.

	Scenario: A student User wants to see the Classes to enroll, but there are no available Classes.
		Given There are no existing Users in the database
		And There are no existing Classes in the database
		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password"
		When Student User tries to view list of available Classes
		Then There are no available Classes

	Scenario Outline: A student User successfully enrolls in a Class.
		Given There are no existing Users in the database
		And There are no existing Courses in the database
		And There are no existing Classes in the database
		And There are no existing ClassEnrollments in the database
		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password"
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password"
		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" with capacity <totalCapacity>, prerequisites "", and precludes ""
		When Student User tries to view list of available Classes
		Then There are available Classes
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled
	Examples:
		| totalCapacity	|
		| 200			|
		| 2				|
		| 1				|

	Scenario: A student User tries to enroll in a Class that they are already enrolled in.
		Given There are no existing Users in the database
		And There are no existing Courses in the database
		And There are no existing Classes in the database
		And There are no existing ClassEnrollments in the database
		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password"
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password"
		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" with capacity 150, prerequisites "", and precludes ""
		When Student User tries to view list of available Classes
		Then There are available Classes
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student does not enroll and an error is returned

	Scenario: A student User tries to enroll in a Class that is already full.
		Given There are no existing Users in the database
		And There are no existing Courses in the database
		And There are no existing Classes in the database
		And There are no existing ClassEnrollments in the database
		And There exists a "student" "Fast McGee" with email "fast@guy.com" and password "TheSpeedySpeedster99"
		And There exists a "student" "Slowy Slowerson" with email "slow@guy.com" and password "password"
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password"
		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" with capacity 1, prerequisites "", and precludes ""
		When Student User tries to view list of available Classes
		Then There are available Classes
		And Student with email "fast@guy.com" wants to enroll in the Class
		And Student is successfully enrolled
		And Student with email "slow@guy.com" wants to enroll in the Class
		And Student does not enroll and an error is returned