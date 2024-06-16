const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
   name:{
        type:String,
        required:true
    },
    slug:{
        type:String
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:mongoose.ObjectId,
        ref:'Category',
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    shipping:{
        type:Boolean,
    },
    photo:{
        type:String,
    },
    cloudinary_id: {
        type:String,
    }
},{timestamps:true});

module.exports = mongoose.model("Product",productSchema);