# Tabbed Login
A custom login,signup and forgo form which can be used as an alternative to the default Mendix login page.

## Description
Contains Tabs to login form, sign up and reset your password forms respectively

## Contributing
For more information on contributing to this repository visit [Contributing to a GitHub repository](https://github.com/sendimarvin/Tabbed-login.git)!

## Features
- Use this widget to enable **local users** to login from any page in your Mendix application
- This widget can also be used to create **local users** account directly into your Mendix application using the sign up tab.
- A 'Forgot password' tab that retrieves the account associated with a specific email.

## Limitations
- Input credentials are authenticated with user credentials available in System.User entity(local accounts). Logging in with Mendix SSO account credentials, using this widget, will not result in being logged in.
- when the widget is inserted in a dataview without context, it will lose its signup forms since this requires a non-persitent entity for temporarily holding the user credentials

## Configuration
- Insert the widget in a page. The widget works well in both pages with or without context
- Configure the properties
- create a Login entity in your domain model containing UserName, Email and Password Attributes.
- Select the signup microflow with a Boolean return type that will be used for form validations. In the same microflow for the true boolean path, create a NewAccount and NewAcountPasswordData instance, set the user roles for the NewAccount instance to User. Set the NewPassword and the ConfirmPassword Atrributes for the NewAccountPasswordData to those in the Login entity respectively. After that, the call the SaveNewAccount Microflow to save the account instance into the System.User Entity.
-  For The forgot password form, select the microflow to be executed when the button on the fogotpasswod tab is clicked. Customize the microflow to open a page continning recovery information or any other activity you would like.
NOTE: the FullName attribute in the Account Entity acts as the email Attribute

## Properties

### SignUp
* *select Entity* - select a non-persistent entity to handle your signup credentials
* *User Name* - Select a userName attribute from the non-persistent Entity
* *password* - Select a Password attribute from the non-persistent Entity
* *Email Address* - Select an Email attribute from the non-persistent Entity
* *Action Microflow* - Choose a signup microflow that will save th credentials into the System.user Entity

### Behavior
* *Forgot Password* - select an Action microflow to execute when user forgot password
* *Show Progress Bar* - choose yes if you want the progress bar to appear incase of a slow network
* *Login Failure warnings* - to enable warning incase of login failures
* *Login Failure Text* - Enter custom login failure Text
* *Focus User Input Field* - Enable auto selection of an input field by default
* *Clear passwords* - Clears Passwords for failed logins
* *Clear username* - Clears username for failed logins
* *Auto-complete* - Completes automatically for credentials that have been ever entered previously

### Display
* *Username placeholder* - Standard text to be displayed in username field
* *Password placeholder* - Standard text to be displayed in password field
* *Show Labels* - Enable this to display custom labels
* *Username Label* - Username label caption
* *Password Label* - Password label caption
* *Login button caption* - Text to be displayed on login button
* *Empty username/password message* - Feedback message shown when a user didn't provide all credentials
* *Email Label* - Email label caption
* *Signup button caption* - Text to be displayed on signup button
* *Signup button caption* - Text to be displayed on signup button

### Behaviour
* *Show progress bar* - Display a progress bar while signing in
* *Forgot password microflow* - Microflow being triggered in case of 'forgot password' onclick
* *Focus username input field* - Move focus to username field when the form is showed (only use this if it is not done automatically)
* *Login Failure Text* - Warning message to show when login fails twice
* *Auto complete* - Enables/disables autocomplete functionality on username and password input field

### Mobile
* *Auto capitalize* - Enables/disables auto capitalize functionality on username input field for mobile devices
* *Auto correct* - Enables/disables auto correct functionality on username input field for mobile devices
* *Username Keyboard Type* - The keyboard type to display when the user is entering their username

### Casehandling
* Convert to lower/uppercase - this option will convert user name input to upper/lower case. Using this functionality only makes practical sense when all usernames defined in your application are either upper or lower cased.
NOTE: MxAdmin administrative user will be accessible in both cases as well.

## Known issues
- Mendix runtime returns no feedback about the existence of a username. This is by design.


##Typical Usage Scenario
when creating a web application that needs authorized personel to access resources specific to them alone.

##Dependencies
- Mendix 6 Environment

##Known Bugs

None