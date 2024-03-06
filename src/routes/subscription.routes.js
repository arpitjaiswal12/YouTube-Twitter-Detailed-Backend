import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addSubscription, getSubscriberCount } from "../controllers/subscription.controller.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/add-subscription").post(addSubscription);
router.route("/subscribers").get(getSubscriberCount);

export default router;
