Feature: An administrator User can delete Users.

	Scenario: An administrator User can delete student Users. It should delete all data related to the student.
		Given There are no existing Users in the database
		And There exists a "professor" "NamCao Nguyen" with email "namo@namo.com" and password "password" and courses taken ""
		And There is a course in the database with code "NAMO1001" and title "How to be Rad" and prereqs "" and precludes ""
		And There exists a Class for "NAMO1001" taught by professor with email "namo@namo.com" with capacity 50
		And There exists a "student" "Johnson Joe" with email "gmail@gmail.com" and password "somuchworktodo" and courses taken ""
		And The student is enrolled in the Class
		And The professor creates a deliverable for the class with title "Deliverable 1" with a weight of 100 and a description of "Submit the homework from yesterdays class"
		And Student with email "gmail@gmail.com" submits a text file with name "tester.txt" and contents "Hello."
		When Admin tries to delete the student with email "gmail@gmail.com"
		Then All information pertaining to the deleted student was removed from the database