import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    post: { type: String },
    caption: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    members: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    comment: [{ type: mongoose.Schema.ObjectId, ref: "Comment" }],
    cloudpostname: { type: String },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
