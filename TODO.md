# ToDos

## General

- [ ] Create a common model project
- [ ] Support for iOS/Android specific notification properties
- [ ] Support for additional data property for notifications
- [ ] Dockerize
- [ ] Optimize build
- [ ] Abstract logic to use any database
- [x] Support for multiple users with different logins
- [ ] Support for user groups
- [ ] Expire notifications 
- [ ] Schedule notifications
- [ ] Recurring notifications
- [ ] Log for sent notifications
  - [ ] Delete them periodically (time can be set via settings)
- [ ] Possibility to acknowledge notifications from client

## Frontend

- [ ] Add profile page
- [ ] Find a better routing solution for login/home and sub routes
- [x] Support for filtering notifications
  - [x] by expiration
  - [x] by app identifier
- [ ] Improve password complexity
- [ ] Global navigation logic
- [ ] Add more translations
    - [ ] German
- [ ] Add settings page
    - [ ] Add button to open settings dialog to right menu
    - [ ] Settings that can be changed
    - [ ] Settings are only available for admin users
    - [ ] Time for deleting notifications log
- [x] Add about dialog
- [ ] Fix design for mobile devices
- [ ] Support different environments

## Backend

- [ ] Improve error handling
- [ ] Add support for Keycloak
- [x] Add default admin username from configuration
