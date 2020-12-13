Feature: Deleting a class
        
@cancelClass
	Scenario: An admin creates and deletes a class, then it doesn't exist
        Given There are no existing classes in the database
		And there are no courses in the database
		And There are no existing ClassEnrollments in the database
		And There is a course in the database with code "COMP4004" and title "Software Quality Assurance" and prereqs "" and precludes ""
		And there are no professors in the database
		And There exists a "professor" "Jean-Pierre Corriveau" with email "jp@gmail.com" and password "password" and courses taken ""
		And An admin tries to create a class for course code "COMP4004" with "Jean-Pierre Corriveau" and capacity 150
		And There exists a class for the "COMP4004" with "Jean-Pierre Corriveau" and capacity 150
		When An Admin deletes a class for course code "COMP4004" with "Jean-Pierre Corriveau"
		Then There does not exist a class for course code "COMP4004" with "Jean-Pierre Corriveau"