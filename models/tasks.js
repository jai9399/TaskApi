require('../db/mongoose')

const mongoose= require('mongoose')
const taskSchema = mongoose.Schema({
    task:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Users'
}},{timestamps:true})
const tasks = mongoose.model('Tasks',taskSchema)
module.exports=tasks;