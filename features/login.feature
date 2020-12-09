Feature: Login

@test74
	Scenario Outline: A student/prof logs in and enters their information correctly.
		Given There are no accounts in the database
		And There is an <accountType> account made in the database with <email> and "12345678"
		When A user tries to login with email <email> and password "12345678"
		Then User logs in
	Examples:
		| accountType			| email						|
		| "student"				| "tj@gmail.com"			|
		| "professor"			| "tj@gmail.com"			|

@test75
	Scenario Outline: A student logs in and enters their information incorrectly.
		Given There are no accounts in the database
		And There is an <accountType> account made in the database with <email> and <password>
		When A user tries to login with email <attemptedEmail> and password <attemptedPassword>
		Then User fails to login

	Examples:
		| accountType			| email						| password			| attemptedEmail			| attemptedPassword |
		| "student"				| "tj@gmail.com"			| "password"		| "bademail@bademail.com"	| "password"		|
		| "professor"			| "tj@gmail.com"			| "password"		| "tj@gmail.com"			| "badpassword"		|
		| "administrator"		| "tj@gmail.com"			| "password"		| "bademail@bademail.com"	| "badpassword"		|