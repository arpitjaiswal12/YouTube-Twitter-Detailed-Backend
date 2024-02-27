import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true, //This specifies that any leading or trailing whitespace should be removed from the username field before saving it to the database.
      index: true, // this is optimize searching
      /*  {{bahut sooch samjh ke index rakha jata hai verna performance ki baand bajti hai }}
        index: true: This specifies that an index should be created on the username field. Indexes are used to optimize queries, such as searching for documents based on the value of the indexed field. In this case, an index on the username field would allow for faster searching based on usernames.
        */
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    avatar: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//is code ko jabh he run krna jab passowrd field modify ho
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // field modify nhi hua to

  this.password = await bcrypt.hash(this.password, 10);
  next();
}); // events that may execute // jab bhe data save ho raha ho mujhe kuch kaam karwana hai  // here we does not use arrow function beacuse arrow function does not support "this" keyword , but here this reference is important // async because encription is time taking process// this is "pre" hook

//  but this pre method always call we user save its profile or save its avatar

/*Defining the custom methods - isPasswordCorrect is user define method*/
userSchema.methods.isPasswordCorrect = async function (passowrd) {
  return await bcrypt.compare(passowrd, this.passowrd);
};

userSchema.methods.generateAccessToken = function () {
  // jwt.sign() // this method generate token
  jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () { //this token only refresh to generate acess token 
  jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
