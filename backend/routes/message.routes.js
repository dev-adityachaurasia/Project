import express from "express";
import isAuthantication from "../middlewares/isAuthinticated.js";
import {
  deleteAllMessages,
  getAllMessages,
  getAllParticipants,
  getPreviousConversations,
  sendMessage,
  unsendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.route("/message/:id").post(isAuthantication, sendMessage);
router.route("/allmessage/:id").post(isAuthantication, getAllMessages);
router.route("/unsend/:messageId").post(isAuthantication, unsendMessage);
router
  .route("/deletechat/:conversationId")
  .post(isAuthantication, deleteAllMessages);
router.route("/allparticapant/:id").post(isAuthantication, getAllParticipants);
router.route("/lastmessage").post(isAuthantication, getPreviousConversations);

export default router;