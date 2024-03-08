import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscriptions.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const addSubscription = asyncHandler(async (req, res) => {
  //current user must be login
  //get channel from reguest
  // subscriber is the current user

  const subscriber = req.user?._id;
  if (!subscriber) {
    throw new ApiError(400, "currentUser not exist !");
  }

  const { channel } = req.body;

  // check user is already subscribe or not

  const checkSubscription = await Subscription.findOne({
    $or: [{ channel }],
  });
  console.log(checkSubscription);
  if (checkSubscription) {
    throw new ApiError(401, "User already Subscribed");
  }

  const subscription = await Subscription.create({
    channel,
    subscriber,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, subscription, "User Subscribed successfully "));
});

const getSubscriberCount = asyncHandler(async (req, res) => {
  const user = req.user?._id;
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user.subscribersCount,
        "Subscriber fetched successfully"
      )
    );
});

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channel } = req.params; //jis cahnnel ko current user subscribe kr raha hai
  // TODO: toggle subscription
  const subscriber = req.user?._id; //current user
  console.log(subscriber);
  if (!subscriber) {
    throw new ApiError(400, "User is not Authenticated !!");
  }

  const checkAlreadySubscribe = await Subscription.findOne({
    $and: [{ channel }, { subscriber }], // check both must not be in same document
  });
  console.log("Check User is already subscribed data: ", checkAlreadySubscribe);

  if (checkAlreadySubscribe) {
    throw new ApiError(401, "User is already subscribed");
  }
  console.log(channel);
  console.log(subscriber);
  const subscription = await Subscription.create({
    channel,
    subscriber,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, subscription, "User subscribed successfully "));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const channel = req.user?._id;
  console.log(channel);

  if (!channel) {
    throw new ApiError(401, "User is not authenticated !");
  }
  const subscriber = await Subscription.find({
    $and: [{ subscriber: channel }],
  }); // jaha jaha mera channel aa raha hai vo document dado,

  console.log(subscriber);
  subscriber.map((key) => {
    console.log("subscriber", key.channel);
  });

  if (!subscriber) {
    throw new ApiError(404, "Subscribers not found !");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, subscriber, "Subscriber fetched successfully !!")
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const channel = req.user?._id;
  if (!channel) {
    throw new ApiError(401, "unauthorized request !");
  }

  const channelList = await Subscription.find({
    $and: [{ channel: channel }],
  });
  if (!channelList) {
    throw new ApiError(400, "Channel not found !");
  }
  console.log(channelList);

  return res
    .status(200)
    .json(
      new ApiResponse(200, channelList, "User channel fetched successfully !")
    );
});

export {
  addSubscription,
  getSubscriberCount,
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels
};
