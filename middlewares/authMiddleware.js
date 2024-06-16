const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel");

//protected Routes Token base
const requireSignIn = async (req,res,next)=>{
    try {
        const decode = await JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode;//we are decoding the user
        next();
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Error in authorization",
            error
        })
    }
}

//admin access
const isAdmin = async (req,res,next) => {
   try {
      const user = await userModel.findById(req.user._id);
      if(user.role !== 1)
      {
        return res.status(401).send({
            success:false,
            message:"unauthorized access"
        })
      }
      else
      {
        next();
      }
    
   } catch (error) {
       res.status(401).send({
        success:false,
        message:"Error in admin middleware"
       })
   }
}

module.exports = {requireSignIn,isAdmin};