import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    self:{type:mongoose.Schema.ObjectId,ref:"User"},
    messanger:{type:mongoose.Schema.ObjectId,ref:"User"},
    message:{type:String,required:true}
})

export const Message = mongoose.model("Message",messageSchema)