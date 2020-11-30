Feature: Professors can Calculate and/or Submit Final Grades

	Scenario Outline: A professor calculates a final grade for a student in their class
        Given The database is clear
		And There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12

		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password" and courses taken ""
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password" and courses taken ""

		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" taught by professor with email "namo@namo.com" with capacity 300
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled
        
        When A professor with email "namo@namo.com" creates a deliverable for their class with course code "NAMO1001", titled <d1> with weight <w1>
        And A professor with email "namo@namo.com" creates a deliverable for their class with course code "NAMO1001", titled <d2> with weight <w2>
        And A professor with email "namo@namo.com" creates a deliverable for their class with course code "NAMO1001", titled <d3> with weight <w3>

        And A student with email "gmail@gmail.com" submits a text file named "My Submission 1" for deliverable <d1>
        And A student with email "gmail@gmail.com" submits a text file named "My Submission 2" for deliverable <d2>
        And A student with email "gmail@gmail.com" submits a text file named "My Submission 3" for deliverable <d3>

        And A professor grades a submission for deliverable <d1> as <g1> and is successful
        And A professor grades a submission for deliverable <d2> as <g2> and is successful
        And A professor grades a submission for deliverable <d3> as <g3> and is successful

		Then A professor with email "namo@namo.com" calculates the final grade for a student with email "gmail@gmail.com" in their class with course code "NAMO1001" as being <calculated>

	Examples:
		|  d1  | w1 | g1 |  d2  | w2 | g2 |  d3  | w3 | g3 | calculated |
		| "A1" | 25 | 40 | "A2" | 25 | 60 | "A3" | 50 | 70 |         60 |
		| "A1" |  1 | 90 | "A2" |  2 | 60 | "A3" |  3 | 30 |         50 |
	

	Scenario: A professor overrides the final grade for a student in their class and succeeds
        Given The database is clear
		And There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12

		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password" and courses taken ""
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password" and courses taken ""

		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" taught by professor with email "namo@namo.com" with capacity 300
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled
        
        When A professor with email "namo@namo.com" creates a deliverable for their class with course code "NAMO1001", titled "A1" with weight 50
        And A professor with email "namo@namo.com" creates a deliverable for their class with course code "NAMO1001", titled "A2" with weight 50

        And A student with email "gmail@gmail.com" submits a text file named "My Submission 1" for deliverable "A1"
        And A student with email "gmail@gmail.com" submits a text file named "My Submission 2" for deliverable "A2"

        And A professor grades a submission for deliverable "A1" as 30 and is successful
        And A professor grades a submission for deliverable "A2" as 40 and is successful

		Then A professor with email "namo@namo.com" submits the final grade for a student with email "gmail@gmail.com" in their class with course code "NAMO1001" as being 50 and is successful
	
		Scenario: A professor overrides the final grade for a student in their class
        Given The database is clear
		And There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12

		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password" and courses taken ""
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password" and courses taken ""

		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" taught by professor with email "namo@namo.com" with capacity 300
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled
        
        When A professor with email "namo@namo.com" creates a deliverable for their class with course code "NAMO1001", titled "A1" with weight 50
        And A professor with email "namo@namo.com" creates a deliverable for their class with course code "NAMO1001", titled "A2" with weight 50

        And A student with email "gmail@gmail.com" submits a text file named "My Submission 1" for deliverable "A1"
        And A student with email "gmail@gmail.com" submits a text file named "My Submission 2" for deliverable "A2"

        And A professor grades a submission for deliverable "A1" as 30 and is successful
        And A professor grades a submission for deliverable "A2" as 40 and is successful

		Then A professor with email "namo@namo.com" calculates the final grade for a student with email "gmail@gmail.com" in their class with course code "NAMO1001" as being 35
		And A professor with email "namo@namo.com" submits the final grade for a student with email "gmail@gmail.com" in their class with course code "NAMO1001" as being 500 and fails


	Scenario: A professor overrides the final grade for a student in their class with an invalid number and fails
        Given The database is clear
		And There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12

		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password" and courses taken ""
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password" and courses taken ""

		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" taught by professor with email "namo@namo.com" with capacity 300
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled
        
        When A professor with email "namo@namo.com" creates a deliverable for their class with course code "NAMO1001", titled "A1" with weight 50
        And A professor with email "namo@namo.com" creates a deliverable for their class with course code "NAMO1001", titled "A2" with weight 50

        And A student with email "gmail@gmail.com" submits a text file named "My Submission 1" for deliverable "A1"
        And A student with email "gmail@gmail.com" submits a text file named "My Submission 2" for deliverable "A2"

        And A professor grades a submission for deliverable "A1" as 30 and is successful
        And A professor grades a submission for deliverable "A2" as 40 and is successful

		Then A professor with email "namo@namo.com" submits the final grade for a student with email "gmail@gmail.com" in their class with course code "NAMO1001" as being 50 and is successful
	
	
	Scenario: A professor tries to submit the final grade for a student who has withdrawn from their class and fails
        Given The database is clear
		And There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 12, day 12

		And There exists a "student" "Joe Johnson" with email "gmail@gmail.com" and password "password" and courses taken ""
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password" and courses taken ""

		And There exists a Course "NAMO1001" with title "How to be Rad"
		And There exists a Class for "NAMO1001" taught by professor with email "namo@namo.com" with capacity 300
		And Student with email "gmail@gmail.com" wants to enroll in the Class
		And Student is successfully enrolled
        
        When A professor with email "namo@namo.com" creates a deliverable for their class with course code "NAMO1001", titled "A1" with weight 100
        And A student with email "gmail@gmail.com" submits a text file named "My Submission 1" for deliverable "A1"
        And A professor grades a submission for deliverable "A1" as 70 and is successful
		
		And The administrator wants to update the Academic Deadline to year 2020, month 1, day 1
		And The Academic Deadline is successfully updated to year 2020, month 1, day 1
		
		And Student with email "gmail@gmail.com" successfully withdraws from the class for course with code "NAMO1001" with DR
		And Student with email "gmail@gmail.com" is enrolled in class for course with code "NAMO1001"
		And Student with email "gmail@gmail.com" has a grade of "WDN" in class for course with code "NAMO1001"

		Then A professor with email "namo@namo.com" submits the final grade for a student with email "gmail@gmail.com" in their class with course code "NAMO1001" as being 70 and fails