import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addSubscription, getSubscribedChannels, getSubscriberCount, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// router.route("/add-subscription").post(addSubscription);
router.route("/add-subscription/:channel").post(toggleSubscription);
// router.route("/subscribers").get(getSubscriberCount);
router.route("/channel-subscribers").get(getUserChannelSubscribers);
router.route("/channels").get(getSubscribedChannels);

export default router;
