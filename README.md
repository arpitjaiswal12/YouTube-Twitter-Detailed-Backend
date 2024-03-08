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
npm i multer </br>
npm i cloudinary 

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

**100** - Continue: The client should continue with its request. This is typically used when the server wants to confirm receipt of part of a request.

**102** - Processing: This is an interim response used to inform the client that the server has received the request and is processing it.

**200** - OK: The request has succeeded. The information returned with the response is dependent on the method used in the request, for example, GET requests return requested content.

**201** - Created: The request has been fulfilled, resulting in the creation of a new resource.

**202** - Accepted: The request has been accepted for processing, but the processing has not been completed yet.

**307** - Temporary Redirect: The requested page has been temporarily moved to a new URL. The client should continue to use the original URL for future requests.

**308** - Permanent Redirect: Similar to 307, but indicates that the requested page has been permanently moved to a new URL.

**400** - Bad Request: The request cannot be fulfilled due to bad syntax or other client-side error.

**401** - Unauthorized: The request requires user authentication. The client must provide credentials to access the requested resource.

**402** - Payment Required: This code is reserved for future use and represents the possibility of digital cash or some form of online payment.

**404** - Not Found: The server cannot find the requested resource.

**409** - Conflict: Indicates that the request could not be processed because of a conflict in the request.

**500** - Internal Server Error: A generic error message indicating that an unexpected condition was encountered on the server.

**504** - Gateway Timeout: The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server it accessed in attempting to complete the request.

### To include subscriber count and channel count in a user profile.
So why we have created a different subscriptionSchema?

[content](https://github.com/arpitjaiswal12/detailed-backend/assets/97618151/4cb3d909-72c4-42c7-8561-29f1cfbce4ba)

[Subscriber_schema_discription](https://github.com/arpitjaiswal12/detailed-backend/assets/97618151/5b5cbaef-2c98-4a75-9efb-12b0292a5251)

## Introduction to Aggregate pipeline MongoDB:
[Reference](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/?_ga=2.158260031.485675367.1709374307-82685267.1702966918#aggregation-pipeline)

1. An aggregation pipeline in MongoDB is a sequence of stages that process documents. Each stage **performs an operation on the input** ***documents*** and passes the ***output to the next stage***.
2. Aggregation pipelines allow you to perform complex analytics and data processing tasks on your data.
3. An aggregation pipeline can **return results for groups of documents**. For example, return the total, average, maximum, and minimum values.
[Aggregation_Pipeline](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/?_ga=2.158260031.485675367.1709374307-82685267.1702966918)

#### Stages in pipelines:-
1. $match - The $match stage in the aggregation pipeline is used to **filter documents** and *pass only the ones* that match the specified condition(s) to the *next stage* of the pipeline. { $match: { <query> } }
   [$match_aggregation](https://www.mongodb.com/docs/manual/reference/operator/aggregation/match/?_ga=2.183359523.485675367.1709374307-82685267.1702966918#-match--aggregation-)
2. $lookup - The $lookup stage in the aggregation pipeline is used to perform a **left outer join** between two collections.
   </br>
   Here is the syntax for the $lookup stage:
   </br>
{   </br>
  $lookup: {   </br>
    from: "<foreignCollection>", // from: Specifies the name of the foreign collection to join with.    </br>
    localField: "<localField>", // localField: Specifies the field from the input documents that will be used for the join.   </br>
    foreignField: "<foreignField>", // foreignField: Specifies the field from the foreign collection that will be used for the join.   </br>
    as: "<outputArray>", // as: Specifies the name of the new array field that will contain the joined documents.   </br>
  }   </br>
}   </br>
[$lookup_aggregation](https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/?_ga=2.78002321.485675367.1709374307-82685267.1702966918#-lookup--aggregation)
</br>
3. $addFields - The $addFields stage in the aggregation pipeline is used to add new fields to documents (schema). It outputs documents that contain all existing fields from the input documents and the newly added fields.
[$addFields_aggregation](https://www.mongodb.com/docs/manual/reference/operator/aggregation/addFields/?_ga=2.157758143.485675367.1709374307-82685267.1702966918#-addfields--aggregation)    </br>
5. $project - The $project operator in MongoDB is used in the aggregation pipeline to shape the output of the documents. It allows you to include or exclude specific fields from the output.
[$project_aggregation](https://www.mongodb.com/docs/manual/reference/operator/aggregation/project/#-project--aggregation)

### Subpipeline using aggregations:

[sub-pipeline-watchHistory](https://github.com/arpitjaiswal12/detailed-backend/assets/97618151/d787fe90-caf7-4756-b747-eba7af94755d)

$match: This is the initial stage in the main pipeline and is not a part of the sub-pipeline. *It filters the User collection based on the provided _id*.

$lookup: This is the *beginning of the sub-pipeline*. It performs a **left outer join** with the **videos** collection based on the *watchHistory* field in the *User collection and the _id field in the videos collection*.

$lookup: This is the *start of a nested sub-pipeline* within the first $lookup stage. It performs another left outer join with the users collection based on the owner field in the videos collection and the _id field in the users collection.

$project: This is another stage within the nested sub-pipeline. *It projects only the username and avatar fields from the users collection*.

$addFields: This is the final stage within the nested sub-pipeline. It adds a *new field called owner to the videos documents*, which contains the result of the $first operation on the owner array returned by the nested $lookup stage.

The outer $lookup stage in the main pipeline is then followed by the $addFields stage, which renames the watchHistory field to watchHistory, returning the updated User documents.

**req.user._id return *String* and internally mongoose convert it to _id: ObjectId('65e0e9fbfdf7te5d501e2')**

### what does this module do "import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
When you perform an aggregation query in MongoDB using Mongoose, *the result set might be large, especially in scenarios like analytics or reporting where you are processing a large amount of data*. In such cases, it's common to paginate the results to improve performance and user experience. **Pagination involves breaking the result set into smaller, more manageable chunks or pages**.
<br>
Mongoose's built-in pagination methods allow you to paginate the results of queries made using the "find()" method:-


















