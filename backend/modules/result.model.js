import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    result: { type: String, required: true },
    title: { type: String, required: true },
    year: { type: String, required: true },
    branch: { type: String, required: true },
    sem: { type: String, required: true },
    kt: { type: Boolean, default: false },
    reval: { type: Boolean, default: false },
    cloudpostname: { type: String },
  },
  { timestamps: true }
);

export const Result = mongoose.model("Result", resultSchema);
