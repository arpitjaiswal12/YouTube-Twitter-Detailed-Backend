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

const changePassword = asyncHandler(async (req, res) => {
  // mujhe sabse pahela login user se uski id leni padegi
  // phir mai request body se old - user sa - oldPasswod aur new password luga
  // mai confirm password bhe la skta hu lakin - vo frontend pr check ho jayega

  const { oldPassword, newPassword } = req.body;

  /*const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!(confirmPassword === newPassword)) {
    throw new ApiError(400, "password is not matched !");
  }*/

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(401, "User is not authenticated !!");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword); //check user old password is correct

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Inavlid old password");
  }

  user.password = newPassword; // user scema sa password change kra
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully !!")); // {} no data is sending
});

const getCurrentUser = asyncHandler(async (req, res) => {
  // as user is alread loggedIn
  // authmiddleware give u current user
  return res
    .status(200)
    .json(
      new ApiResponse(200, req.user, "current user fetched successfully !")
    );
});

const updateAccount = asyncHandler(async (req, res) => {
  // what i need to update :: username, fullName, avatar,coverImage
  // as user us login get current user id and update database by this value
  // production mai kya hota hai ki file update krna ke liya alag controller banta hai
  const { username, fullName, email } = req.body;
  //check karo dono aa rahi hai ki nhi
  if (!(username || fullName || email)) {
    throw new ApiError(400, "All fields are required!!");
  }

  // ab muhe db mai find krna hai ki username/ mail database mai kisi aur user ka same to nhi hai
  const checkExistence = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (checkExistence) {
    throw new ApiError(
      409,
      "Username or email already exist !! Try with another Username or email"
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email,
        username: username,
      },
    },
    { new: true } //new true karega to update hone ka baad information return hogi
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account Updated Successfully !!"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  // user pahela loggedIn honga chiye ye check karo
  //req.body sa avatar lena hai
  // ab pahela multer mai luga - localServer pr ayegi - middleaware
  // phir usako cloudinary mai upload kr ke - url luga
  // aur url to db mai update

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file missing !");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while updating avatar !");
  }

  const updatedAvatar = await User.findByIdAndUpdate(
    req.user?._id /* optionaly unwrap */,
    {
      $set: {
        // specific things to update - that's why use set
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  res.status(200).json(200, updatedAvatar, "Avatar updated successfully !");
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  // user pahela loggedIn honga chiye ye check karo
  //req.body sa avatar lena hai
  // ab pahela multer mai luga - localServer pr ayegi - middleaware
  // phir usako cloudinary mai upload kr ke - url luga
  // aur url to db mai update

  const CoverImageLocalPath = req.file?.path;

  if (!CoverImageLocalPath) {
    throw new ApiError(400, "CoverImage file is missing !");
  }

  const coverImage = await uploadOnCloudinary(avatarLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, "Error while updating/uploading CoverImage !");
  }

  const updatedCoverImage = await User.findByIdAndUpdate(
    req.user?._id /* optionaly unwrap */,
    {
      $set: {
        // specific things to update - that's why use set
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedCoverImage, "Avatar updated successfully !")
    );
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  // from the request parameter i will find the username and get its channel
  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, "Username is missing!");
  }

  // now need to create an channel

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    }, // this pipeline returns the complete user with this provided username
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id", //id from user schema
        foreignField: "channel", // outside document which paramter need to be compare so as channel consist of id of user
        as: "subscribers", // name of new array - this will contain result of join operation
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber", // as subscriber also contain the id of user
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        // this fields are added to Userschema with attribute name  "subscribersCount" and "channelsSubscribedToCount"
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] }, // is my user_id is subscribed to an channel
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        // the fields which need to be pass to user are marked as flag
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "channel does not exists !");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateAccount,
  updateUserAvatar,
  updateUserCoverImage,
};
