Feature: A administrator User can set the Academic Deadline.

	Scenario Outline: An administrator User successfully updates the Academic Deadline.
		Given There is an Academic Deadline set in the database
		When The administrator wants to update the Academic Deadline to year <year>, month <month>, day <day>
		Then The Academic Deadline is successfully updated to year <year>, month <month>, day <day>
	Examples:
		| year	| month	| day	|
		| 2025	| 12	| 30	|
		| 2020	| 1		| 25	|
		| 2020	| 7		| 1		|

	Scenario Outline: An administrator User tries to update the Academic Deadline, but enters invalid inputs.
		Given There is an Academic Deadline set in the database
		When The administrator wants to update the Academic Deadline to year <year>, month <month>, day <day>
		Then The Academic Deadline is not updated
	Examples:
		| year	| month	| day	|
		# Test for a negative input.
		| -5	| 4		| 15	|
		| 2020	| -4	| 15	|
		| 2020	| 4		| -15	|
		# Test for a year before 2020.
		| 2019	| 4		| 15	|
		# Test for a month out of range of 1-12.
		| 2020	| 0		| 15	|
		| 2020	| 13	| 15	|
		# Test for a day out of range of 1-31.
		| 2020	| 4		| 0		|
		| 2020	| 4		| 32	|