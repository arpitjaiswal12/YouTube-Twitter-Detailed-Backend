import { json } from "express";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.fileUpload.js";

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, duration, isPublished } = req.body;
  // TODO: get video, upload to cloudinary, create video
  //Algo:
  //the user must be login
  // get userId from current user
  //from multer file get user video
  // upload video on cloudinary
  //get url from cloudinary
  // save to database

  const owner = req.user?._id;
  if (!owner) {
    throw new ApiError(401, "User need to login to upload video !");
  }

  console.log(req.files);
  const videoFile = req.files?.videoFile[0]?.path;
  const thumbnail = req.files?.thumbnail[0]?.path;
  console.log(videoFile);

  if (!videoFile) {
    throw new ApiError(400, "Please upload video!");
  }

  // now upload on cloudinary
  const uploadVideofile = await uploadOnCloudinary(videoFile);
  const uploadThumbnail = await uploadOnCloudinary(thumbnail);

  const video = await Video.create({
    title,
    description,
    duration,
    isPublished,
    owner,
    videoFile: uploadVideofile?.url || "hello",
    thumbnail: uploadThumbnail?.url || "world",
  });

  console.log(video);

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video uploaded successfully !"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video Not Found !!");
  }

  console.log(video);

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Uploaded successfully !"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video

  const deleteVideo = await Video.findByIdAndDelete(videoId);

  if (!deleteVideo) {
    throw new ApiError(400, "Video is not deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deleteVideo, "video deleted successfully"));
});


// this will return all videos uploaded by the user 
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    // get current user 
    // search video document from current user and return that 
    const owner=req.user?._id;

    const videos=await Video.find({owner})
    if(!videos){
        throw new ApiError(400,"Videos are not found !")
    }

    console.log(videos)
    return res.status(200).json(new ApiResponse(200,videos,"All videos are fetched!!"))
})

export { publishAVideo, getVideoById,deleteVideo ,getAllVideos};
