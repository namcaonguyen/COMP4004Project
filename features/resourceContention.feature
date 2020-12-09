Feature: This feature file is to test out Resource Contention. See the Deliverable document for more details.

@test104
	Scenario: This scenario tests when two students want to enroll in the last slot of a Class.
		Given The database is clear
		And There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 1, day 1
		And "student" 1 applies for an account with name "Joe Johnson", email "first@student.com", password "password"
		And "student" 2 applies for an account with name "Boolean Bob", email "second@student.com", password "truefalse"
		And "student" 3 applies for an account with name "Brainy Brian", email "third@student.com", password "smarterthaneinstein"
		And "professor" 1 applies for an account with name "NamCao Nguyen", email "namo@namo.com", password "password"
		And An admin approves the account application for "student" 1
		And An admin approves the account application for "student" 2
		And An admin approves the account application for "student" 3
		And An admin approves the account application for "professor" 1
		And An admin creates Course 1 for "UHOH1001" with title "Danger Course" and prereqs "" and precludes ""
		And An admin creates Class 1 for Course 1 taught by Professor 1 with capacity 2
		And Student 1 enrolls in Class 1
		And Student 2 wants to enroll in Class 1
		And Student 3 wants to enroll in Class 1
		When All students who want to enroll in Class 1 try to enroll at the same time
		Then Only 1 of the students that wanted to enroll in Class 1 were able to

@test108
	Scenario: This scenario tests when two students want to enroll in the last slot of a Class, while another student drops out.
		Given The database is clear
		And There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 1, day 1
		And "student" 1 applies for an account with name "Joe Johnson", email "first@student.com", password "password"
		And "student" 2 applies for an account with name "Boolean Bob", email "second@student.com", password "truefalse"
		And "student" 3 applies for an account with name "Brainy Brian", email "third@student.com", password "smarterthaneinstein"
		And "professor" 1 applies for an account with name "NamCao Nguyen", email "namo@namo.com", password "password"
		And An admin approves the account application for "student" 1
		And An admin approves the account application for "student" 2
		And An admin approves the account application for "student" 3
		And An admin approves the account application for "professor" 1
		And An admin creates Course 1 for "UHOH1001" with title "Danger Course" and prereqs "" and precludes ""
		And An admin creates Class 1 for Course 1 taught by Professor 1 with capacity 2
		And Student 2 enrolls in Class 1
		And Student 1 wants to enroll in Class 1
		And Student 3 wants to enroll in Class 1
		When All students who want to enroll in Class 1 try to enroll at the same time while student 2 drops the Class
		Then No more than 2 of the students that wanted to enroll in Class 1 should have been able to