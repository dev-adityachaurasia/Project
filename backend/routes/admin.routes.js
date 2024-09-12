import express from "express";
import isAuthantication from "../middlewares/isAuthinticated.js";
import upload from "../middlewares/multer.js";
import { deleteResult, editResult, uploadResult } from "../controllers/admin.controller.js";

const router = express.Router();

router
  .route("/uploadresult")
  .post(isAuthantication, upload.single("result"), uploadResult);
  router.route("/deleteresult/:id").post(isAuthantication,deleteResult)
  router.route("/editresult/:id").post(isAuthantication,editResult)

export default router;
