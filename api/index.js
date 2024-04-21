import mongoose from "mongoose";
import connectDB from "../src/database/dbconnect.js";
import dotenv from "dotenv"
// import express  from "express";
// const app=express();
import {app} from "../src/app.js"
const PORT=process.env.PORT || 8000;
dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.listen( PORT,()=>{
        console.log(`Server is running at PORT : ${PORT}`)
    })
})
.catch((err)=>{
    console.log("MONGODB connection failed !!",err)
})
