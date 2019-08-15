const mongoose=require("mongoose")
const valditor=require("validator")

const TaskSchema= new mongoose.Schema({
    description:{
        type:String,
        trim:true,
        required:true

    },
    complet:{
        type:Boolean,
        default:false
    },
    owner:{
         type:mongoose.Schema.Types.ObjectId,
         required:true,
         ref:'User'
    }
},{
    timestamps:true
})

const task = mongoose.model("task",TaskSchema)
module.exports=task