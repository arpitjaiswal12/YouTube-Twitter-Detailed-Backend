# This repository consists of a detailed introduction to the backend- 
## Useful references: 
[express](https://expressjs.com/en/5x/api.html)
[json-Vs-Bson](https://www.mongodb.com/json-and-bson)
[jwt](https://github.com/auth0/node-jsonwebtoken#readme)

## What Are:
### Access Token 
* It typically contains information about the user and the permissions granted to the application.
* An access token is a temporary token used by an application to access protected resources on behalf of a user.
* Access tokens have a limited lifespan and expire after a certain period, after which the application needs to obtain a new access token by presenting a valid refresh token.
### Refresh Token 
* A refresh token is a long-lived token used by an application to obtain new access tokens when the current access token expires.
* When the access token expires, the application can use the refresh token to request a new access token **without requiring the user to log in again**.
* Refresh tokens are usually stored securely to prevent unauthorized access, such as in an HTTP-only cookie or a secure storage mechanism.
