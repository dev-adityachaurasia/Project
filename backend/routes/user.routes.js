import express from "express";
import {
  editProfile,
  followUnfollow,
  getProfile,
  login,
  logout,
  signIn,
  suggetUser,
} from "../controllers/user.controller.js";
import isAuthantication from "../middlewares/isAuthinticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();  

router.route("/register").post(signIn);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/suggest").post(isAuthantication, suggetUser);
router.route("/:username").get(isAuthantication, getProfile);
router
  .route("/update")
  .post(isAuthantication, upload.single("profilePic"), editProfile);
router
  .route("/followunfollow/:username")
  .post(isAuthantication, followUnfollow);

export default router;
