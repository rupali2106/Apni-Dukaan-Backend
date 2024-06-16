const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim: true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },
    address:{
        type:{},
    },
    question:{
        type:String,
    },
    role:{
        type:Number,
        default:0
    }

},{timestamps:true});

module.exports = mongoose.model("User",UserSchema);