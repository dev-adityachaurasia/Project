import express from "express";
import upload from "../middlewares/multer.js";
import {
  commentPost,
  deletePost,
  dislikePost,
  editPost,
  getAllPost,
  getComments,
  getUserPost,
  likePost,
  newPost,
  savePost,
} from "../controllers/post.controller.js";
import isAuthantication from "../middlewares/isAuthinticated.js";

const router = express.Router();

router.route("/post").post(isAuthantication, upload.single("post"), newPost);
router.route("/allpost").post(isAuthantication, getAllPost);
router.route("/:username/post").get(getUserPost);
router.route("/editpost/:postid").post(isAuthantication, editPost);
router.route("/like/:postid").get(isAuthantication, likePost);
router.route("/dislike/:postid").get(isAuthantication, dislikePost);
router.route("/c/:postid").get(isAuthantication, getComments);
router.route("/comment/:postid").post(isAuthantication, commentPost);
router.route("/deletepost/:postid").post(isAuthantication, deletePost);
router.route("/savepost/:postid").post(isAuthantication, savePost);

export default router;