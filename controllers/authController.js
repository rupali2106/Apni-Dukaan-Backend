const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");
const feedbackModel = require("../models/feedbackModel");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const JWT = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { name, email, phone, password, question, address } = req.body;
    //validation
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!password) {
      return res.send({ message: "password is required" });
    }

    //existing user check
    const existinguser = await userModel.findOne({ email });
    if (existinguser) {
      res.status(200).send({
        success: false,
        message: "Already registerd please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone: "",
      password: hashedPassword,
      question: "",
      address: "",
    }).save();
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).send({
      success: true,
      message: "Register Successfull",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    //check user is present or not
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    //comparing password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid credentials",
      });
    }
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfull",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

//forgot password controller
const forgotPasswordController = async (req, res) => {
  try {
    const { email, question, newPassword } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    if (!question) {
      return res.status(400).send({ message: "Question is required" });
    }
    if (!newPassword) {
      return res.status(400).send({ message: "Password is required" });
    }
    //find user
    const user = await userModel.findOne({ email, question });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    return res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Forgot-Password",
      error,
    });
  }
};

//testcontroller
const testController = (req, res) => {
  res.send("Protected Route");
};

//update profile controller
const updateProfileController = async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;
    if (password && password.length < 6) {
      return res.json({
        error: "password is required and minlength should be 6",
      });
    }

    //check user is present or not
    const existing_user = await userModel.findOne({ email });
    const hashed = password
      ? await hashPassword(password)
      : existing_user.password;
    const user = await userModel.findByIdAndUpdate(
      existing_user._id,
      {
        password: hashed,
        name: name || existing_user.name,
        address: address || existing_user.address,
        phone: phone || existing_user.phone,
      },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "Profile updated Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Updating Data",
      error,
    });
  }
};

//orders
const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//orders
const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order-status

const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

const googleSignController = async (req, res) => {
  try {
    const { name, email} = req.body;
      const user = await userModel.findOne({email});
      if (user) {
        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
         return res.status(200).send({
          success: true,
          message: "login successfull",
          user: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
          },
          token,
        });
      } else {
        const pass = email + process.env.JWT_SECRET;
        const hashedPassword = await hashPassword(pass);
        const user = await new userModel({
          name,
          email,
          password: hashedPassword,
          phone: "",
          question: "",
          address: "",
        }).save();
        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
        return res.status(201).send({
          success: true,
          message: "Register Successfull",
          user: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
          },
          token,
        });
      }

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error?.message || error,
    });
  }
};

//const feedback
const feedbackController = async(req,res) =>{
  try {
    const {feedback} = req.body;
    await new feedbackModel({
      feedback:feedback,
      user:req.user._id,
    }).save()
    return res.status(200).send({
      message:"Thanks for Giving your Feedback",
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error?.message || error,
    });
  }
}

module.exports = {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  googleSignController,
  feedbackController,
};
