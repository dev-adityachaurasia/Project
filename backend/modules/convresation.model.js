import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  psrticapant: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  message: [{ type: mongoose.Schema.ObjectId,ref: "Messaage" }],
});

export const Conversation = mongoose.model("Conversation", conversationSchema);
