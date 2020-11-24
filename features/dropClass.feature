Feature: Students can drop classes without DR (TODO: with DR)

	Scenario Outline: A student enrolls in a class then drops it with no DR
		Given There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12
		And There are no existing Users in the database
		And There are no existing Courses in the database
		And There are no existing Classes in the database
		And There are no existing ClassEnrollments in the database

		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password"
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password"

		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" with capacity 300, prerequisites "", and precludes ""
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled

		And Student with email "gmail@gmail.com" is enrolled in class for course with code "NAMO1001"
		When Student with email "gmail@gmail.com" successfully drops class for course with code "NAMO1001" for no DR
		Then Student with email "gmail@gmail.com" is not enrolled in class for course with code "NAMO1001"


	Scenario Outline: A student enrolls in two classes then drops one class with no DR
		Given There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12
		And There are no existing Users in the database
		And There are no existing Courses in the database
		And There are no existing Classes in the database
		And There are no existing ClassEnrollments in the database

		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password"
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password"

		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" with capacity 300, prerequisites "", and precludes ""
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled

		And There exists a Course "NAMO1002" with title "How to be Rad Part 2"
		And There exists a Class for "NAMO1002" with capacity 300, prerequisites "", and precludes ""
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled
		
		And Student with email "gmail@gmail.com" is enrolled in class for course with code "NAMO1001"
		When Student with email "gmail@gmail.com" successfully drops class for course with code "NAMO1001" for no DR
		Then Student with email "gmail@gmail.com" is not enrolled in class for course with code "NAMO1001"
		And Student with email "gmail@gmail.com" is enrolled in class for course with code "NAMO1002"


	Scenario Outline: A student enrolls in a class then drops it with no DR, then does it all again
		Given There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12
		And There are no existing Users in the database
		And There are no existing Courses in the database
		And There are no existing Classes in the database
		And There are no existing ClassEnrollments in the database

		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password"
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password"

		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" with capacity 300, prerequisites "", and precludes ""
		
		When Student with email "gmail@gmail.com" is not enrolled in class for course with code "NAMO1001"

		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled
		And Student with email "gmail@gmail.com" is enrolled in class for course with code "NAMO1001"
		And Student with email "gmail@gmail.com" successfully drops class for course with code "NAMO1001" for no DR
		And Student with email "gmail@gmail.com" is not enrolled in class for course with code "NAMO1001"
		
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled
		And Student with email "gmail@gmail.com" is enrolled in class for course with code "NAMO1001"
		And Student with email "gmail@gmail.com" successfully drops class for course with code "NAMO1001" for no DR
		Then Student with email "gmail@gmail.com" is not enrolled in class for course with code "NAMO1001"
