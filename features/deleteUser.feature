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

	Scenario: An administrator User deletes a professor who is not assigned to any classes.
		Given There are no existing Users in the database
		And There exists a "professor" "TJ Mendicino" with email "tj@cms.com" and password "password" and courses taken ""
		When Admin tries to delete the professor with email "tj@cms.com"
		Then The professor does not exist in the database

	Scenario: An administrator User deletes a professor who is assigned to a class.
		Given There are no existing Users in the database
		And There exists a "professor" "TJ Mendicino" with email "tj@cms.com" and password "password" and courses taken ""
		And There is a course in the database with code "COMP3203" and title "Principles of Computer Networks" and prereqs "" and precludes ""
		And There exists a Class for "COMP3203" taught by professor with email "tj@cms.com" with capacity 5
		When Admin tries to delete the professor with email "tj@cms.com"
		Then The professor does not exist in the database along with all of the classes they teach and the related class enrollments

	Scenario: An administrator User deletes another an admin.
		Given There are no existing Users in the database
		And There exists a "administrator" "TJ Mendicino" with email "tj@cms.admin.com" and password "password" and courses taken ""
		And There exists a "administrator" "the admin remover" with email "idestroyadminaccounts@cms.com" and password "password" and courses taken ""
		When Admin with email "idestroyadminaccounts@cms.com" tries to delete the administrator with email "tj@cms.admin.com"
		Then The attempted deleted administrator does not exist in the database

	Scenario: An administrator User tries to delete themself but cannot.
		Given There are no existing Users in the database
		And There exists a "administrator" "the admin remover" with email "idestroyadminaccounts@cms.com" and password "password" and courses taken ""
		When Admin with email "idestroyadminaccounts@cms.com" tries to delete the administrator with email "idestroyadminaccounts@cms.com"
		Then The attempted deleted administrator still exists in the database