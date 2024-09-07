import mongooose from "mongoose";

const commmetSchema = new mongooose.Schema(
  {
    comment: { type: String },
    author: { type: mongooose.Schema.ObjectId, ref: "User" },
    post: { type: mongooose.Schema.ObjectId, ref: "Post" },
  },
  { timestamps: true }
);

export const Comment = mongooose.model("Comment", commmetSchema);
