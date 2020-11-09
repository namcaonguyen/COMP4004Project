Feature: Login

	Scenario: A student logs in and enters their information correctly.
		Given There are no accounts in the database
		And There is an "student" account made in the database with "tj@gmail.com" and "12345678"
		When A user tries to login with email "tj@gmail.com" and password "12345678"
		Then User logs in

	Scenario Outline: A student logs in and enters their information incorrectly.
		Given There are no accounts in the database
		And There is an <accountType> account made in the database with <email> and <password>
		When A user tries to login with email <attemptedEmail> and password <attemptedPassword>
		Then User fails to login

	Examples:
		| accountType			| email						| password			| attemptedEmail			| attemptedPassword |
		| "student"				| "tj@gmail.com"			| "password"		| "bademail@bademail.com"	| "password"		|
		| "administrator"		| "tj@gmail.com"			| "password"		| "tj@gmail.com"			| "badpassword"		|
		| "administrator"		| "tj@gmail.com"			| "password"		| "bademail@bademail.com"	| "badpassword"		|