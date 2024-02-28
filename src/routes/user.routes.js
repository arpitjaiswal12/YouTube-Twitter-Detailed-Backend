import { Router } from "express";
import { registerUser, loginUser,logoutUser } from "../controllers/user.controller.js";
import { upload, verifyJWT } from "../middlewares/multer.middleware.js";

const router = Router();

// router.post("/register",registerUser); or

router.route("/register").post(
  upload.fields([
    // added middleware
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// secure route - on login user

router.route("/logout",verifyJWT,logoutUser);

export default router;
