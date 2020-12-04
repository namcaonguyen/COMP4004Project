Feature: Apply for Account Feature

	Scenario Outline: A User applies for an account and enters their information correctly.
		Given There are no existing Users
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

	Scenario Outline: A User applies for an account and enters their information incorrectly.
		Given There are no existing Users
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

	Scenario: A User applies for an account and enters an email that is already registered.
		Given There are no existing Users
		And A <accountType> user exists with name "First Guy" email <email> and password "secretkey"
		When A <accountType> user tries to apply with name <firstName> <lastName>
		And User email is <email>
		And User password <password> is confirmed as <confirmPassword>
		Then Input fields are not valid with <number> errors
		And The Application is not saved to the database
	Examples:
		| accountType	| firstName	| lastName	| email						| password		| confirmPassword	| number	|
		| "student"		| "Joe"		| "Johnson"	| "already@registered.com"	| "password123"	| "password123"		| 1			|
		| "professor"	| "Joe"		| ""		| "already@registered.com"	| "password123"	| "password123"		| 2			|
		| "student"		| ""		| "Johnson"	| "already@registered.com"	| "password123"	| "password123"		| 2			|
		| "professor"	| "Joe"		| "Johnson"	| "already@registered.com"	| "pass"		| "pass"			| 2			|
		| "student"		| "Jo"		| "Johnson"	| "already@registered.com"	| "password123"	| "password456"		| 2			|
		| "professor"	| ""		| ""		| "already@registered.com"	| "pass"		| "no"				| 5			|