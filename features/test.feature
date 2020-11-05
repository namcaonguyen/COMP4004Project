Feature: Test Feature

    Scenario: Adding two numbers together
        Given X is 1 and Y is 2
        When We add x and y
        Then The result should be 3

    Scenario Outline: Adding two numbers together outline
        Given X is <x> and Y is <y>
        When We add x and y
        Then The result should be <result>
    Examples:
        | x | y | result |
        | 1 | 8 | 9      |
        | 5 | 2 | 7      |
        | 2 | 4 | 6      |
        | 9 | 1 | 10     |

    Scenario: Test User Objects
        Given A new is created
        And The users name is "Zahid"
        And The users age is 21
        And The user is taking "COMP4004,COMP4001"
        Then Output the user should be "Hi my name is Zahid and I am 21. The courses that I am taking this year are COMP4004,COMP4001"
