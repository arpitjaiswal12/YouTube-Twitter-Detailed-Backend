import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.fileUpload.js";
import { storeImage } from "../utils/firebase.fileupload.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// method to generate access and refresh tokens

const generateAccessAndRefreshToken = async (userID) => {
  try {
    const user = await User.findById(userID);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false }); // does not need to check validation

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went while generating refresh and token! "
    );
  }
};

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
  const existedUser = await User.findOne({
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

  //const avatar = await uploadOnCloudinary(avatarLocalPath); // this will take time to upload  // this will return response
  //const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  // const avatar = storeImage(avatarLocalPath.originalname); // this will take time to upload  // this will return response
  // console.log(avatar);
  // const coverImage = storeImage(coverImageLocalPath.originalname);

  // if (!avatar) {
  //   throw new ApiError(400, "Avatr is required !");
  // }

  // entry in database
  const user = await User.create({
    fullName,
    // avatar:avatar.url
    avatar:
      "https://cdn4.vectorstock.com/i/1000x1000/06/18/male-avatar-profile-picture-vector-10210618.jpg",
    coverImage: "", //agar coverImage hai to url nekal lo
    // coverImage: coverImage?.url || "", //agar coverImage hai to url nekal lo
    email,
    password,
    username: username.toLowerCase(),
  });

  console.log(user);

  // check kr rahe hai ki user bana hai ki nhi
  const createdUser = await User.findById(user._id).select(
    // ye jo select method sabko bydefault select karegi to mujhe usme se password aur refreshToken nhi chiye
    "-password -refreshToken" //this will remove both (syntax hai )
  ); // password or refreshtoken islye remove kra tha ki vo ApiResponse mai nhi dekha
  if (!createdUser) {
    throw new ApiError(500, "Error while registering user !!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully")); // json response jo jayega vo already define hai - ApiResponse mai
});

const loginUser = asyncHandler(async (req, res) => {
  // get data - username/email,password
  //find user exist or not
  // if not then tell to register
  // check password
  // access and refresh token
  //send cookies - secure
  // return response

  const { username, email, password } = req.body;
  console.log(email);

  if (!(username || email)) {
    throw new ApiError(400, "username or email is required !!");
  }

  //instance of object
  const user = await User.findOne({
    $or: [{ username }, { email }], //array ke andar object pass kr sakte ho
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // send cookies - while sending cookies we need to design options
  // cookies can be modified by default from frontend
  const options = {
    httpOnly: true,
    secure: true,
  }; //this cookies can only modified from server only

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: accessToken,
          refreshToken,
          loggedInUser,
        },
        "user logged In sucessfully!!"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //geeting the current user
  //update or clear the current user cookies so it get logged out
  await User.findByIdAndUpdate(
    req.user._id, //as user is login and update
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true, //prevent the overall update of schema values rather only update refreshToken
    }
  );

  const options = {
    // means cookies can only be updated from server
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options) // clearing the cookies as user is logged out
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  //acess refreshtoken
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unaithorized request");
  }
  // verify the refresh token from backend and cookies
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token !");
    }

    // check token
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "RefreshToken is expired or used");
    }

    //generate tokens
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Accessed token is refreshed !"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token ");
  }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
