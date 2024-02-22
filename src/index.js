import mongoose from "mongoose";
import connectDB from "./database/dbconnect.js";
import dotenv from "dotenv"

dotenv.config({
    path:'./env'
})

connectDB();
