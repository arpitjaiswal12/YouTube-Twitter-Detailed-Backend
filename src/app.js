// this is express app
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

//app.use() // this method is use of middleware configuration

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
)

app.use(express.json({ limit: "16kb" })); // json data accept from form  and setting is limit
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // extended is use for object within object
app.use(express.static("public"))
app.use(cookieParser())


//importing router
import userRouter from "./routes/user.routes.js"
import subcriptionRouter from "./routes/subscription.routes.js"

//routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/subscription",subcriptionRouter)

export { app };
