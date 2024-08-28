import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    author:{type:mongoose.Schema.ObjectId,ref:"User",required:true},
    post:{type:String,required:true},
    caption:{type:String,default:""},
    likes:[{type:mongoose.Schema.ObjectId,ref:"User"}],
    tag:[{type:mongoose.Schema.ObjectId,ref:"User"}],
    comment:[{type:mongoose.Schema.ObjectId,ref:"Comment"}]
})

export const Post = mongoose.model("Post",postSchema)