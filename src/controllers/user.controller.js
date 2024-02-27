import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.fileUpload.js";
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
  //get user detail-data (in request)
  // validation - check username, email not empty
  // check username,email must be unqiue - check by username & email
  //check for avatar - by multer
  //upload them to cloudinary, avatar check
  // create user object - create entry in db
  //remove password and refresh token field
  // check user creation
  // return res

  const { username, email, fullName, password } = req.body; // req.body access given by express
  // console.log(username,email)

  /*if (username === "" || email === "" || fullName === "" || password === "") {
    return ApiError(400, "All fields are necessary");
  }*/
  // or

  if (
    [username, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // check email having @ or not
  if (!email.includes("@")) {
    throw new ApiError(400, "Email must be valid");
  }

  /* This is a Mongoose query method that searches for a single document in the User collection that matches the specified criteria. In this case, it's using the $or operator to search for documents where either the "username" or the "email" field matches one of the provided values. */
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  console.log(existedUser);

  if (existedUser) {
    throw new ApiError(409, "User with username and email already exist");
  }
  //check for file
  console.log(req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  console.log(avatarLocalPath);
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // now upload files to cloudinary

  const avatar = await uploadOnCloudinary(avatarLocalPath); // this will take time to upload  // this will return response
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatr is required !");
  }

  // entry in database
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "", //agar coverImage hai to url nekal lo
    email,
    password,
    username: username.toLowerCase(),
  });

  console.log(user)

  // check kr rahe hai ki user bana hai ki nhi 
  const createdUser=await User.findById(user._id).select(  // ye jo select method sabko bydefault select karegi to mujhe usme se password aur refreshToken nhi chiye
    "-password -refreshToken"  //this will remove both (syntax hai )
  )// password or refreshtoken islye remove kra tha ki vo ApiResponse mai nhi dekha
  if(!createdUser){
    throw new ApiError(500, "Error while registering user !!")
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered successfully")
  )  // json response jo jayega vo already define hai - ApiResponse mai 


});

export { registerUser };
