import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    messanger:[{type:mongoose.Schema.ObjectId,ref:'User'}],
    message:[{type:mongoose.Schema.ObjectId,ref:'Message'}]
},{timestamps:true})