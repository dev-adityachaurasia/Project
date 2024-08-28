import mongooose from 'mongoose'

const userSchema = new mongooose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    branch:{type:String,required:true},
    college:{type:String,required:true},
    profilePic:{type:String,default:""},
    year:{type:String,required:true},
    bio:{type:String},
    phone:{type:Number},
    posts:[{type:mongooose.Schema.ObjectId,ref:"User"}], 
    saved:[{type:mongooose.Schema.ObjectId,ref:"User"}], 
    follower:[{type:mongooose.Schema.ObjectId,ref:"User"}], 
    following:[{type:mongooose.Schema.ObjectId,ref:"User"}], 
    liked:[{type:mongooose.Schema.ObjectId,ref:"Post"}], 
},{timestamps:true})

export const User = mongooose.model('User',userSchema);