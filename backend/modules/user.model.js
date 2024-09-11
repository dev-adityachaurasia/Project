import mongooose from "mongoose";

const userSchema = new mongooose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    branch: { type: String, required: true },
    college: { type: String, required: true },
    profilePic: { type: String, default: "" },
    year: { type: String, required: true },
    phone: { type: Number },
    posts: [{ type: mongooose.Schema.ObjectId, ref: "User" }],
    saved: [{ type: mongooose.Schema.ObjectId, ref: "User" }],
    member: [{ type: mongooose.Schema.ObjectId, ref: "Post" }],
    follower: [{ type: mongooose.Schema.ObjectId, ref: "User" }],
    following: [{ type: mongooose.Schema.ObjectId, ref: "User" }],
    liked: [{ type: mongooose.Schema.ObjectId, ref: "Post" }],
    private: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongooose.model("User", userSchema);
