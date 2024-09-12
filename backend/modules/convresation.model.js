import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  message: [{ type: mongoose.Schema.ObjectId, ref: "Message" }], // Fixed typo
});

export const Conversation = mongoose.model("Conversation", conversationSchema);
