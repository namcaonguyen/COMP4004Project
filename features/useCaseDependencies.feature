Feature: This feature file is to test out the Use Case Dependencies. See the Deliverable document for more details.

	Scenario: This long scenario should cover all the valid use case dependencies.
		Given The database is clear
		# A
		And There is an Academic Deadline set in the database
		And The administrator wants to update the Academic Deadline to year 3000, month 1, day 1
		# F(sid1)
		And "student" 1 applies for an account with name "Joe Johnson", email "first@student.com", password "password"
		# F(sid2)
		And "student" 2 applies for an account with name "Boolean Bob", email "second@student.com", password "truefalse"
		# F(sid3)
		And "student" 3 applies for an account with name "Brainy Brian", email "third@student.com", password "smarterthaneinstein"
		# G(pid1)
		And "professor" 1 applies for an account with name "NamCao Nguyen", email "namo@namo.com", password "password"
		# G(pid2)
		And "professor" 2 applies for an account with name "Proffy Prof", email "proffy@prof.com", password "profprofprof"
		# G(pid3)
		And "professor" 3 applies for an account with name "Krazy Taxi", email "outof@control.com", password "parkingviolation"
		# B(sid1)
		And An admin can see the account application for "student" 1
		# B(sid2)
		And An admin can see the account application for "student" 2
		# B(sid3)
		And An admin can see the account application for "student" 3
		# B(pid1)
		And An admin can see the account application for "professor" 1
		# B(pid2)
		And An admin can see the account application for "professor" 2
		# B(pid3)
		And An admin can see the account application for "professor" 3
		# C(sid3)
		And An admin rejects the account application for "student" 3
		# C(pid3)
		And An admin rejects the account application for "professor" 3
		# D(sid1)
		And An admin approves the account application for "student" 1
		# D(sid2)
		And An admin approves the account application for "student" 2
		# D(pid1)
		And An admin approves the account application for "professor" 1
		# D(pid2)
		And An admin approves the account application for "professor" 2
		# H(cid1)
		And An admin creates Course 1 for "COMP4004" with title "Software Quality Assurance" and prereqs "" and precludes ""
		# H(cid2)
		And An admin creates Course 2 for "NAMO1001" with title "How to be Rad" and prereqs "" and precludes ""
		# H(cid3)
		And An admin creates Course 3 for "EXCL1001" with title "Top Secret Course" and prereqs "NAMO1001" and precludes ""
		# H(cid4)
		And An admin creates Course 4 for "YEAH1001" with title "A Good Course" and prereqs "" and precludes ""
		# I(tid1,cid4,pid2)
		And An admin creates Class 1 for Course 4 taught by Professor 2 with capacity 50
		# J(cid4)
		And An admin deletes Course 4
		# M(sid1)
		And "student" 1 can login with email "first@student.com" and password "password"
		# N(sid1,cid2)
		And Student 1 edits their past Courses to add "NAMO1001" and remove ""
		# I(tid2,cid3,pid2)
		And An admin creates Class 2 for Course 3 taught by Professor 2 with capacity 50
		# O(sid1,tid2)
		And Student 1 enrolls in Class 2
		# P(sid1,tid2)
		And Student 1 can see Class 2 in their Class list
		# Q(sid1,tid2)
		And Student 1 drops Class 2 with no DR
		# I(tid3,cid2,pid1)
		And An admin creates Class 3 for Course 2 taught by Professor 1 with capacity 50
		# M(sid2)
		And "student" 2 can login with email "second@student.com" and password "truefalse"
		# O(sid2,tid3)
		And Student 2 enrolls in Class 3
		# O(sid1,tid3)
		And Student 1 enrolls in Class 3
		# L(tid3)
		And An admin cancels Class 3
		# I(tid4,cid1,pid1)
		And An admin creates Class 4 for Course 1 taught by Professor 1 with capacity 50
		# O(sid1,tid4)
		And Student 1 enrolls in Class 4
		# P(sid1,tid4)
		And Student 1 can see Class 4 in their Class list
		# O(sid2,tid4)
		And Student 2 enrolls in Class 4
		# S(pid1)
		When "professor" 1 can login with email "namo@namo.com" and password "password"
		# T(pid1,tid4)
		And Professor 1 can see Class 4 in their Class list
		# U(did1,tid4)
		And The professor creates Deliverable 1 for Class 4 with title "First Deliverable", description "Do stuff.", and weight 10
		# V(sid1,did1)
		And Student 1 submits for Deliverable 1 a text file with name "CarefullyResearchedEssay.txt" and contents "Hello, I spent 500 hours on this essay."
		# U(did2,tid4)
		And The professor creates Deliverable 2 for Class 4 with title "Second Deliverable", description "Do more stuff.", and weight 90
		# V(sid1,did2)
		And Student 1 submits for Deliverable 2 a text file with name "MoreTimeSpent.txt" and contents "I spent even more time on this because it's worth 90%. I hope I get a good mark."
		# P(sid2,tid4)
		And Student 2 can see Class 4 in their Class list
		# V(sid2,did1)
		And Student 2 submits for Deliverable 1 a text file with name "LastMinuteGarbage.txt" and contents "Assignment's due soon. Gonna throw together some garbage."
		# V(sid2,did2)
		And Student 2 submits for Deliverable 2 a text file with name "Oops.txt" and contents "I accidently left in some text that I was supposed to delete for the last assignment. How do I remove"
		# W(did1,sid1)
		And Professor grades Deliverable 1 for Student 1 with a mark of 70
		# W(did1,sid2)
		And Professor grades Deliverable 1 for Student 2 with a mark of 100
		# W(did2,sid1)
		And Professor grades Deliverable 2 for Student 1 with a mark of 55
		# W(did2,sid2)
		And Professor grades Deliverable 2 for Student 2 with a mark of 100
		# X(sid1,tid4)
		And Professor calculates a final grade for Student 1 of Class 4
		# X(sid2,tid4)
		And Professor calculates a final grade for Student 2 of Class 4
		# Y(sid2,tid4)
		Then Student 2 sees their grade of 100 for Class 4
		# Y(sid1,tid4)
		Then Student 1 sees their grade of 56.5 for Class 4
		# A
		And The administrator wants to update the Academic Deadline to year 2020, month 11, day 30
		# R(sid1,tid4)
		And Student 1 drops Class 4 with DR
		# K(tid2)
		And An admin edits Class 2 to be taught by Professor 1 and have capacity 70
		# E(pid2)
		And An admin deletes "professor" 2
		# E(sid2)
		And An admin deletes "student" 2