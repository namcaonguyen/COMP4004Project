Feature: Students can withdraw from classes after deadline with DR

	Scenario: A student enrolls in a class then withdraws from it after the deadline with DR, their grade is then set to WDN
		Given There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 1, day 1

		And There are no existing Users in the database
		And There are no existing Courses in the database
		And There are no existing Classes in the database
		And There are no existing ClassEnrollments in the database

		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password" and courses taken ""
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password" and courses taken ""

		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" taught by professor with email "namo@namo.com" with capacity 300
		
		When Student with email "gmail@gmail.com" is not enrolled in class for course with code "NAMO1001"

		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled
		And Student with email "gmail@gmail.com" is enrolled in class for course with code "NAMO1001"

		And The administrator wants to update the Academic Deadline to year 2020, month 1, day 1
		And The Academic Deadline is successfully updated to year 2020, month 1, day 1

		And Student with email "gmail@gmail.com" successfully withdraws from the class for course with code "NAMO1001" with DR
		Then Student with email "gmail@gmail.com" is enrolled in class for course with code "NAMO1001"
		And Student with email "gmail@gmail.com" has a grade of "WDN" in class for course with code "NAMO1001"

	Scenario: A student enrolls in a class then fails to withdraw from it after the deadline with DR, their grade is unaffected
		Given There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 1, day 1

		And There are no existing Users in the database
		And There are no existing Courses in the database
		And There are no existing Classes in the database
		And There are no existing ClassEnrollments in the database

		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password" and courses taken ""
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password" and courses taken ""

		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" taught by professor with email "namo@namo.com" with capacity 300
		
		When Student with email "gmail@gmail.com" is not enrolled in class for course with code "NAMO1001"

		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled
		And Student with email "gmail@gmail.com" is enrolled in class for course with code "NAMO1001"

		And Student with email "gmail@gmail.com" fails to withdraw from the class for course with code "NAMO1001" with DR
		Then Student with email "gmail@gmail.com" is enrolled in class for course with code "NAMO1001"
		And Student with email "gmail@gmail.com" does not have a grade of "WDN" in class for course with code "NAMO1001"