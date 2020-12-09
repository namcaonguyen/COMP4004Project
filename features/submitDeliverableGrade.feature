Feature: Professors can Grade Deliverable Submissions

	Scenario: A professor submits a grade for a student's deliverable in a class and is successful
        Given The database is clear
		And There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12

		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password" and courses taken ""
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password" and courses taken ""

		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" taught by professor with email "namo@namo.com" with capacity 300
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled
        
        When A professor with email "namo@namo.com" creates a deliverable for their class with course code "NAMO1001", titled "A1" with weight 10
        And A student with email "gmail@gmail.com" submits a text file named "My Submission" for deliverable "A1"
        Then A professor with email "namo@namo.com" grades a submission for deliverable "A1" as 53 and is successful


	Scenario: A professor submits an invalid grade for a student's deliverable in a class and fails
        Given The database is clear
		And There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12

		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password" and courses taken ""
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password" and courses taken ""

		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" taught by professor with email "namo@namo.com" with capacity 300
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled
        
        When A professor with email "namo@namo.com" creates a deliverable for their class with course code "NAMO1001", titled "A1" with weight 10
        And A student with email "gmail@gmail.com" submits a text file named "My Submission" for deliverable "A1"
        Then A professor with email "namo@namo.com" grades a submission for deliverable "A1" as 500 and fails


	Scenario: A professor tries submitting a grade for a student's submission in a class they don't teach
        Given The database is clear
		And There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12

		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password" and courses taken ""
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password" and courses taken ""
		And There exists a "professor" "Jean-Pierre Corriveau" with email "jeanpierre.corriveau@carleton.ca" and password "password" and courses taken ""

		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" taught by professor with email "namo@namo.com" with capacity 300
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled
        
        When A professor with email "namo@namo.com" creates a deliverable for their class with course code "NAMO1001", titled "A1" with weight 10
        And A student with email "gmail@gmail.com" submits a text file named "My Submission" for deliverable "A1"

        Then A professor with email "jeanpierre.corriveau@carleton.ca" grades a submission for deliverable "A1" as 50 and fails


	Scenario: A professor tries submitting a grade for a student's submission in a class that's been deleted
        Given The database is clear
		And There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12

		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password" and courses taken ""
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password" and courses taken ""

		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" taught by professor with email "namo@namo.com" with capacity 300
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled
        
        When A professor with email "namo@namo.com" creates a deliverable for their class with course code "NAMO1001", titled "A1" with weight 10
        And A student with email "gmail@gmail.com" submits a text file named "My Submission" for deliverable "A1"

		And An admin deletes a course with code "NAMO1001"

        Then A professor with email "namo@namo.com" grades a submission for deliverable "A1" as 50 and fails