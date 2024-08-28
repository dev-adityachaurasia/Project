import mongooose from 'mongoose'

const replySchema = new mongooose.Schema({
    reply:{type:String},
    author:{type:mongooose.Schema.ObjectId,ref:"User"},
    comment:{type:mongooose.Schema.ObjectId,ref:"Comment"}
},{timestamps:true})

export const Reply = mongooose.model('Reply',replySchema);