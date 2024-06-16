const express = require("express");
const {registerController,loginController,testController,forgotPasswordController,updateProfileController,getOrdersController,getAllOrdersController,orderStatusController,googleSignController,feedbackController} = require("../controllers/authController.js");
const {requireSignIn,isAdmin} = require("../middlewares/authMiddleware.js");

const router = express.Router();

//routing | Method post
router.post("/register",registerController);

//routing | Goggle Signin
router.post("/google_sign",googleSignController);

//login route
router.post("/login",loginController);

//forgot password route
router.post("/forgot-password", forgotPasswordController);

//testroute
router.get("/test",requireSignIn,isAdmin,testController);

//protected path route auth
router.get('/user-auth',requireSignIn,(req,res) =>{
    res.status(200).json({ok:true});
});

//protected route for admin
router.get('/admin-auth',requireSignIn,isAdmin,(req,res) =>{
    res.status(200).json({ok:true});
});

//update profile

router.put("/profile",requireSignIn,updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders

router.get("/all-orders",requireSignIn,isAdmin,getAllOrdersController);
 
//order status update

router.put("/order-status/:orderId",requireSignIn,isAdmin,orderStatusController);

//feedback
router.post("/feedback",requireSignIn,feedbackController);



module.exports = router;
