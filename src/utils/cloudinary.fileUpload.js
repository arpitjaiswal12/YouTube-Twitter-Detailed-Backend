import { v2 as cloudinary } from "cloudinary"; // here v2 means major version of cloudinary
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log(
      "file Uploaded successfully !! ",
      response,
      "with url : ",
      response.url
    );
    return response;
  } catch (error) {
    // file is on my server but not uploaded then we need to remove that file from our server as it my conatin malicous things 
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    console.log("Error while uploading file pn cloudinary", error);
    return null;
  }
};
