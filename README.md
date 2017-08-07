#Tabbed Login
A custom login and signup form which can be used as an alternative to the default Mendix login page.

## Description
This widget allows users to create accounts, login to a particular website applications and recover their forgotten passwords.
The widget uses the default System.User entity to create account instances and their is no need for creating user entities on usage.


## Contributing
For more information on contributing to this repository visit [Contributing to a GitHub repository](https://github.com/sendimarvin/Tabbed-login.git)!

## Features
- Use this widget to enable **local users** to login from any page in your Mendix application
- This widget can also be used to create **local users** accounts directly into your Mendix application
- A link to open a 'Forgot my password' page

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

### Display
* *Username placeholder* - Standard text to be displayed in username field
* *Password placeholder* - Standard text to be displayed in password field
* *Username Label* - Username label caption
* *Password Label* - Password label caption
* *Login button caption* - Text to be displayed on login button
* *Empty username/password message* - Feedback message shown when a user didn't provide all credentials
* *Forgot password link text* - Text to use in the Forgot password link

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

### Password
* *Show/mask password toggle* - Adds a toggle button to show/mask password.*
* *Show password button caption* - The caption that is used for the show button for the value of the password
* *Mask password button caption* - The caption that is used for the hide button for the value of the password
* *Show password button image* - Optional image to be displayed in 'Show password' button
* *Mask password button image* - Optional image to be displayed in 'Mask password' button

### Casehandling
* Convert to lower/uppercase - this option will convert user name input to upper/lower case. Using this functionality only makes practical sense when all usernames defined in your application are either upper or lower cased.
NOTE: MxAdmin administrative user will be accessible in both cases as well.

## Known issues
- Mendix runtime returns no feedback about the existence of a username. This is by design.



##Typical Usage Scenario
when creating a web application that needs authorized personel to access resources specific to them alone.

##Features And Limitations
- users can log in to web application.
- users can register new users of the web application
- users can also reset their passwords

##Dependencies
- Mendix 6 Environment

##Known Bugs

None