const mongoose = require("mongoose");
const feedbackSchema = new mongoose.Schema({
    user:{
        type:mongoose.ObjectId,
        ref:"User",
    },
    feedback:{
        type:String,
    }
},{timestamps:true})

module.exports = mongoose.model("Feedback",feedbackSchema);