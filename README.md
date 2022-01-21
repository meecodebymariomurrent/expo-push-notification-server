# Expo Push Notification Server with Angular PrimeNG UI

## General

### Registering a subscriber

A client (using the Expo SDK) can register as subscriber.
Therefore, you need to log in to the Expo Push Notification Server UI.

To register a subscriber send a request to the `subcriber/create` endpoint with the following payload:

```javascript
{
  token: "expo-push-notification-token",
  appIdentifierId: "your-app-identifier"
}
```

#### Token:

The expo push notification token received via:

`Notifications.getExpoPushTokenAsync({ experienceId: experienceId })).data;`

#### appIdentifierId

The app identifier created via the Expo Push Notification Server UI

See [Expo App Notification Example](examples/expo/NOTIFICATION.md) for a full example.

### Sending push notifications

Push notifications can be sent to selected subscribers. 
Therefore, you need to log in to the Expo Push Notification Server UI.

## Server

NodeJS Typescript server based on [expressJS](https://expressjs.com/)

### Requirements

- Existing [RethinkDB](https://rethinkdb.com/docs/install/)

### Starting the server

`npm run start`

## Frontend

Angular Frontend

### Starting the frontend

`ng serve`

## ToDos

See [TODO.md](TODO.md) for more information

## Contribute

## Git Commit Message Convention

Please follow the conventional commits specification

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

## License

See [LICENSE.md](LICENSE.md) for more information

### Icons

App Icon from [Smashicons](https://www.flaticon.com/authors/smashicons)
