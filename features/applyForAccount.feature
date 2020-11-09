Feature: Apply for Account Feature

	Scenario Outline: A student applies for an account and enters their information correctly.
		Given There are no unapproved <accountType> applications
		When A <accountType> user tries to apply with name "Joe" "Johnson"
		And User email is "gmail@gmail.com"
		And User password "password123" is confirmed as "password123"
		Then Input fields are valid
		And The Application is saved to the database
	Examples:
		| accountType		|
		| "student"			|
		| "professor"		|
		| "administrator"	|

	Scenario Outline: A student applies for an account and enters their information incorrectly.
		Given There are no unapproved "student" applications
		When A "student" user tries to apply with name <firstName> <lastName>
		And User email is <email>
		And User password <password> is confirmed as <confirmPassword>
		Then Input fields are not valid with <number> errors
		And The Application is not saved to the database
	Examples:
		| firstName	| lastName	| email				| password		| confirmPassword	| number	|
		# Test for an empty First Name.
		| ""		| "Johnson"	| "gmail@gmail.com"	| "password123"	| "password123"		| 1			|
		# Test for an empty Last Name.
		| "Joe"		| ""		| "gmail@gmail.com"	| "password123"	| "password123"		| 1			|
		# Test for an invalid Email.
		| "Joe"		| "Johnson"	| "gmail.com"		| "password123"	| "password123"		| 1			|
		# Test for a password that is too short.
		| "Joe"		| "Johnson"	| "gmail@gmail.com"	| "pass"		| "pass"			| 1			|
		# Test for non-matching passwords.
		| "Joe"		| "Johnson"	| "gmail@gmail.com"	| "password123"	| "password456"		| 1			|
		# Test for multiple errors.
		| ""		| ""		| "hello"			| "asdf"		| "fdsa"			| 5			|