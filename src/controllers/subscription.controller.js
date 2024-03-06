import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscriptions.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

export { addSubscription, getSubscriberCount };
