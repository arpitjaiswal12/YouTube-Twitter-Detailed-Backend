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

## File upload using multer on Cloudinary
npm i multer | npm i cloudinary 
![file_upload](https://github.com/arpitjaiswal12/detailed-backend/assets/97618151/dbbe027a-5341-486a-913f-914b0dd10761)
**DiskStorage** -multer
The disk storage engine gives you full control on storing files to disk.

## HTTP response status
HTTP response status codes indicate whether a specific HTTP request has been successfully completed. Responses are grouped in five classes:

1. Informational responses (100 – 199)
2. Successful responses (200 – 299)
3. Redirection messages (300 – 399)
4. Client error responses (400 – 499)
5. Server error responses (500 – 599)

### Some HTTP status codes :
100 - Continue: The client should continue with its request. This is typically used when the server wants to confirm receipt of part of a request.

102 - Processing: This is an interim response used to inform the client that the server has received the request and is processing it.

200 - OK: The request has succeeded. The information returned with the response is dependent on the method used in the request, for example, GET requests return requested content.

201 - Created: The request has been fulfilled, resulting in the creation of a new resource.

202 - Accepted: The request has been accepted for processing, but the processing has not been completed yet.

307 - Temporary Redirect: The requested page has been temporarily moved to a new URL. The client should continue to use the original URL for future requests.

308 - Permanent Redirect: Similar to 307, but indicates that the requested page has been permanently moved to a new URL.

400 - Bad Request: The request cannot be fulfilled due to bad syntax or other client-side error.

401 - Unauthorized: The request requires user authentication. The client must provide credentials to access the requested resource.

402 - Payment Required: This code is reserved for future use and represents the possibility of digital cash or some form of online payment.

404 - Not Found: The server cannot find the requested resource.

409 - Conflict: Indicates that the request could not be processed because of a conflict in the request.

500 - Internal Server Error: A generic error message indicating that an unexpected condition was encountered on the server.

504 - Gateway Timeout: The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server it accessed in attempting to complete the request.

### To include subscriber count and channel count in a user profile.
So why we have created a different subscriptionSchema?

![content](https://github.com/arpitjaiswal12/detailed-backend/assets/97618151/4cb3d909-72c4-42c7-8561-29f1cfbce4ba)

![Subscriber_schema_discription ](https://github.com/arpitjaiswal12/detailed-backend/assets/97618151/5b5cbaef-2c98-4a75-9efb-12b0292a5251)



