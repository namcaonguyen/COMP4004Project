Feature: Manage Account Requests

@approveAccount
	Scenario: An admin approves an account request
		Given A user registers with the account info "student", "Bob Vance", "bob_vance@cms.com", "password"
		When The admin approves them
		Then The user is able to login
        
@rejectAccount
	Scenario: An admin declines an account request
		Given A user registers with the account info "administrator", "Mike Hunt", "mike_hunt@cms.com", "password"
		When The admin declines them
		Then The user does not exist in the database anymore
        And The user is not able to login