Feature: View Deliverables of a Class

	Scenario Outline: A professor views their deliverables of a class
		Given The database is empty before viewing deliverables
		And There exists a course with code <courseCode> and title <courseTitle> and prereqs <prereqs> and precludes <precludes> before viewing deliverables
		And There exists a "professor" "Jean-Pierre Corriveau" with email "jp@gmail.com" and password "password" and courses taken ""
		And There exists a Class for <courseCode> with capacity <totalCapacity> before viewing deliverables
		When The professor creates a deliverable for the class with title "Deliverable 1" with a weight of <weight> and a description of "Submit the homework from yesterdays class"
		Then The professor can see the deliverable in the deliverables list

	Examples:
		| courseCode    | courseTitle					| prereqs	| precludes | totalCapacity | weight |
		| "COMP4004"	| "Software Quality Assurance"	| ""		| ""		| 200		 	| 10     |

	Scenario Outline: A professor views their deliverables of a class but doesn't find any since none were created
		Given The database is empty before viewing deliverables
		And There exists a course with code <courseCode> and title <courseTitle> and prereqs <prereqs> and precludes <precludes> before viewing deliverables
		And There exists a "professor" "Jean-Pierre Corriveau" with email "jp@gmail.com" and password "password" and courses taken ""
		And There exists a Class for <courseCode> with capacity <totalCapacity> before viewing deliverables
		Then The professor can't see any deliverables in the deliverables list for his class

	Examples:
		| courseCode    | courseTitle					| prereqs	| precludes | totalCapacity |
		| "COMP4004"	| "Software Quality Assurance"	| ""		| ""		| 200		 	|

	Scenario Outline: A student views their deliverables of a class
		Given The database is empty before viewing deliverables
		And There exists a course with code <courseCode> and title <courseTitle> and prereqs <prereqs> and precludes <precludes> before viewing deliverables
		And There exists a "professor" "Jean-Pierre Corriveau" with email "jp@gmail.com" and password "password" and courses taken ""
		And There exists a Class for <courseCode> with capacity <totalCapacity> before viewing deliverables
		And The professor creates a deliverable for the class with title "Deliverable 1" with a weight of <weight> and a description of "Submit the homework from yesterdays class"
		And There exists a "student" "TJ Mendicino" with email "tj@cms.com" and password "password" and courses taken ""
		And The student is enrolled in the Class
		Then The student can see the deliverable in the deliverables list

	Examples:
		| courseCode    | courseTitle					| prereqs	| precludes | totalCapacity | weight |
		| "COMP4004"	| "Software Quality Assurance"	| ""		| ""		| 200		 	| 10     |

	Scenario Outline: A student views their deliverables of a class but doesn't find any since none were created
		Given The database is empty before viewing deliverables
		And There exists a course with code <courseCode> and title <courseTitle> and prereqs <prereqs> and precludes <precludes> before viewing deliverables
		And There exists a "professor" "Jean-Pierre Corriveau" with email "jp@gmail.com" and password "password" and courses taken ""
		And There exists a Class for <courseCode> with capacity <totalCapacity> before viewing deliverables
		And There exists a "student" "TJ Mendicino" with email "tj@cms.com" and password "password" and courses taken ""
		And The student is enrolled in the Class
		Then The student can't see any deliverables in the deliverables list for his class

	Examples:
		| courseCode    | courseTitle					| prereqs	| precludes | totalCapacity | weight |
		| "COMP4004"	| "Software Quality Assurance"	| ""		| ""		| 200		 	| 10     |