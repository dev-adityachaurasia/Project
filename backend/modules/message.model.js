import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.ObjectId, ref: "User" }, // Fixed typo
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
