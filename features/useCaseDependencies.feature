Feature: This feature file is to test out the Use Case Dependencies.

@test84
	Scenario: This long scenario covers Use Case Dependencies for the marking grid.
		Given The database is clear
		And There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 1, day 1

		And "student" 1 applies for an account with name "Joe Johnson", email "first@student.com", password "password"
		And An admin approves the account application for "student" 1
		And An admin creates Course 2 for "NAMO1001" with title "How to be Rad" and prereqs "" and precludes ""

		And "professor"s 1 and 2 apply for an account with name "NamCao Nguyen" and "Proffy Prof", email "namo@namo.com" and "proffy@prof.com", password "password" and "profprofprof"
		And An admin approves the account application for "professor" 1
		And An admin approves the account application for "professor" 2

		And An admin creates Course 1 for "COMP4004" with title "Software Quality Assurance" and prereqs "" and precludes ""
		And An admin creates Course 3 for "EXCL1001" with title "Top Secret Course" and prereqs "" and precludes ""

		And "student"s 2 and 3 apply for an account with name "Boolean Bob" and "Brainy Brian", email "second@student.com" and "third@student.com", password "truefalse" and "smarterthaneinstein"
		And An admin approves the account application for "student" 2
		And An admin approves the account application for "student" 3

		And An admin creates Class 1 for Course 1 taught by Professor 1 with capacity 2
		And An admin creates Class 2 for Course 2 taught by Professor 1 with capacity 2
		And An admin creates Class 3 for Course 3 taught by Professor 2 with capacity 2

		And "student" 2 can login with email "second@student.com" and password "truefalse"
		And "student" 3 can login with email "third@student.com" and password "smarterthaneinstein"
		And "student" 1 can login with email "first@student.com" and password "password"
		And "professor" 1 can login with email "namo@namo.com" and password "password"
		And "professor" 2 can login with email "proffy@prof.com" and password "profprofprof"

		And Student 2 wants to enroll in Class 1
		And Student 3 wants to enroll in Class 1
		And All students who want to enroll in Class 1 try to enroll at the same time
		And Only 2 of the students that wanted to enroll in Class 1 were able to

		And Student 1 enrolls in Class 2
		And Student 1 enrolls in Class 3
		And Student 2 enrolls in Class 3

		When Professor 1 creates Deliverable 1 for Class 1 with title "Project", description "Do stuff.", and weight 100
		And Professor 2 creates Deliverable 2 for Class 3 with title "Essay", description "Write stuff.", and weight 100

		And Student 1 drops Class 2 with no DR

		And Students 2 and 3 submit for Deliverable 1 a text file with name "MyProject.txt" and "StolenProject.txt" and contents "I did a lot of work." and "Someone did a lot of work >:)"

		And Student 1 submits for Deliverable 2 a text file with name "CarefullyResearchedEssay.txt" and contents "Hello, I spent 500 hours on this essay."
		And Student 2 submits for Deliverable 2 a text file with name "LastMinuteGarbage.txt" and contents "Essay's due soon. Gonna throw together some garbage."

		Then Professor 1 grades Deliverable 1 for Student 2 with a mark of 0
		And Professor 1 grades Deliverable 1 for Student 3 with a mark of 100

		And Professor 2 grades Deliverable 2 for Student 1 with a mark of 55
		And Professor 2 grades Deliverable 2 for Student 2 with a mark of 100

		And Professor 1 and 2 calculate a final grade for student 2 of Class 1 and student 1 of Class 3
		And Professor 1 and 2 calculate a final grade for student 3 of Class 1 and student 2 of Class 3
		Then Student 2 sees their grade of 0 for Class 1
		Then Student 1 sees their grade of 55 for Class 3
		Then Student 3 sees their grade of 100 for Class 1
		Then Student 2 sees their grade of 100 for Class 3