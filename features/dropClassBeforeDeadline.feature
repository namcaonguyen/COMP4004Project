Feature: Students can drop classes before deadline without DR

@test38a
	Scenario: A student enrolls in a class then drops it with no DR
		Given There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12
		And There are no existing Users in the database
		And There are no existing Courses in the database
		And There are no existing Classes in the database
		And There are no existing ClassEnrollments in the database

		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password" and courses taken ""
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password" and courses taken ""

		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" taught by professor with email "namo@namo.com" with capacity 300
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled

		And Student with email "gmail@gmail.com" is enrolled in class for course with code "NAMO1001"
		When Student with email "gmail@gmail.com" successfully drops class for course with code "NAMO1001" for no DR
		Then Student with email "gmail@gmail.com" is not enrolled in class for course with code "NAMO1001"

@test38b
	Scenario: A student enrolls in two classes then drops one class with no DR
		Given There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12
		And There are no existing Users in the database
		And There are no existing Courses in the database
		And There are no existing Classes in the database
		And There are no existing ClassEnrollments in the database

		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password" and courses taken ""
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password" and courses taken ""

		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" taught by professor with email "namo@namo.com" with capacity 300
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled

		And There exists a Course "NAMO1002" with title "How to be Rad Part 2"
		And There exists a Class for "NAMO1002" taught by professor with email "namo@namo.com" with capacity 300
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled
		
		And Student with email "gmail@gmail.com" is enrolled in class for course with code "NAMO1001"
		When Student with email "gmail@gmail.com" successfully drops class for course with code "NAMO1001" for no DR
		Then Student with email "gmail@gmail.com" is not enrolled in class for course with code "NAMO1001"
		And Student with email "gmail@gmail.com" is enrolled in class for course with code "NAMO1002"

@test38c
	Scenario: A student enrolls in a class then drops it with no DR, then does it all again
		Given There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12
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
		And Student with email "gmail@gmail.com" successfully drops class for course with code "NAMO1001" for no DR
		And Student with email "gmail@gmail.com" is not enrolled in class for course with code "NAMO1001"
		
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled
		And Student with email "gmail@gmail.com" is enrolled in class for course with code "NAMO1001"
		And Student with email "gmail@gmail.com" successfully drops class for course with code "NAMO1001" for no DR
		Then Student with email "gmail@gmail.com" is not enrolled in class for course with code "NAMO1001"

@test38X
	Scenario: A student enrolls in a class then tries to drop it with no DR, but fails
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

		And Student with email "gmail@gmail.com" fails to drop class for course with code "NAMO1001" for no DR
		Then Student with email "gmail@gmail.com" is enrolled in class for course with code "NAMO1001"
		And Student with email "gmail@gmail.com" does not have a grade of "WDN" in class for course with code "NAMO1001"

@test39
	Scenario: A student enrolls in a class then tries to drop it with no DR, but the class does not exist
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

		And There are no existing Classes in the database
		Then Student with email "gmail@gmail.com" fails to drop class for course with code "NAMO1001" for no DR

@test40
	Scenario: A student enrolls in a class then tries to drop it with no DR, but the student is already not registered in that class anymore
		Given There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12
		And There are no existing Users in the database
		And There are no existing Courses in the database
		And There are no existing Classes in the database
		And There are no existing ClassEnrollments in the database

		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password" and courses taken ""
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password" and courses taken ""

		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" taught by professor with email "namo@namo.com" with capacity 300
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled

		And Student with email "gmail@gmail.com" is enrolled in class for course with code "NAMO1001"
		When Student with email "gmail@gmail.com" successfully drops class for course with code "NAMO1001" for no DR
		Then Student with email "gmail@gmail.com" fails to drop class for course with code "NAMO1001" for no DR