import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.ObjectId, ref: "User" },
    reciver: { type: mongoose.Schema.ObjectId, ref: "User" },
    message: [{ type: mongoose.Schema.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);

