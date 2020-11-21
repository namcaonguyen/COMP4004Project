Feature: An administrator User can edit the information of a Class.

	Scenario Outline: An administrator User tries editing the professor and total capacity of a particular Class. The Class information should be updated.
		Given There are no existing Users in the database
		And There are no existing Courses in the database
		And There are no existing Classes in the database
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password"
		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" with capacity 50, prerequisites "", and precludes ""
		When An administrator tries to switch professors and change the capacity of the Class to <newCapacity>
		Then The Class had its information successfully changed
	Examples:
		| newCapacity	|
		| 1				|
		| 300			|

	Scenario: An administrator User tries editing the professor of a particular Class, but the professor was deleted. The Class information will not be updated.
		Given There are no existing Users in the database
		And There are no existing Courses in the database
		And There are no existing Classes in the database
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password"
		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" with capacity 50, prerequisites "", and precludes ""
		And There exists a "professor" "Soontobe Fired" with email "currently@unemployed.com" and password "jobsearching"
		And The professor was deleted
		When An administrator tries to switch professors and change the capacity of the Class to 45
		Then The Class information is not updated

	Scenario Outline: An administrator User tries editing the total capacity of a particular Class, but enters an invalid value. The Class information will not be updated.
		Given There are no existing Users in the database
		And There are no existing Courses in the database
		And There are no existing Classes in the database
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password"
		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" with capacity 50, prerequisites "", and precludes ""
		When An administrator tries to switch professors and change the capacity of the Class to <newCapacity>
		Then The Class information is not updated
	Examples:
		| newCapacity	|
		| 0				|
		| -1			|

	Scenario: An administrator User tries editing the total capacity of a particular Class to be lower than the current number of enrolled students. The Class information will not be updated.
		Given There are no existing Users in the database
		And There are no existing Courses in the database
		And There are no existing Classes in the database
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password"
		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" with capacity 50, prerequisites "", and precludes ""
		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password"
		And There exists a "student" "Johnson Joe" with email "hotmail@hotmail.com" and password "TheRaddestInTown"
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student with email "hotmail@hotmail.com" wants to enroll in the Class
		# There are 2 students enrolled in the Class, but the administrator will try to set the total capacity to 1.
		When An administrator tries to switch professors and change the capacity of the Class to 1
		Then The Class information is not updated