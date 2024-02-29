import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  //also written as but res is not used so we can write _ in place of res(req,res,next)
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    /* Whenever the user wants to access a protected route or resource, the user agent should send the JWT, typically in the Authorization header using the Bearer schema.
        Authorization: Bearer <token>
         */

    // console.log(token);
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // decoding token

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
