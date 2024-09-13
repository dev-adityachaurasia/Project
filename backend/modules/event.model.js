import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    event: { type: String, required: true },
    lastdate: { type: Date },
    description: { type: String, required: true },
    cloudpostname: { type: String },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
