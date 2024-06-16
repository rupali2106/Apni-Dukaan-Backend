const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const orderModel = require("../models/orderModel");
const fs = require("fs");
const slugify = require("slugify");
const cloudinary = require("../utils/cloudinary");
var braintree = require("braintree");
const dotenv = require("dotenv");
dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
});

const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping ,photo} = req.body;
    //const { photo } = req.file;
    switch (true) {
      case !name: {
        return res.status(400).send({ message: "product name is required" });
      }
      case !description: {
        return res
          .status(400)
          .send({ message: "product description is required" });
      }
      case !price: {
        return res.status(400).send({ message: "product price is required" });
      }
      case !category: {
        return res.status(400).send({ message: "product name is required" });
      }
      case !quantity: {
        return res
          .status(400)
          .send({ message: "product quantity is required" });
      }
      case photo && photo.size < 5000: {
        return res
          .status(400)
          .send({ message: "Image size should be less than 5Mb" });
      }
    }
  
    const result = await cloudinary.uploader.upload(req.file.path);
    const product = new productModel({
       ...req.body, 
      slug: slugify(name),
      photo : result.secure_url,
      cloudinary_id: result.public_id
    });
    
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product created Successfully",
      product,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error,
    });
  }
};

//update product
const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping,photo } =req.body;
    //const { photo } = req.file;
    console.log(photo)
    switch (true) {
      case !name: {
        return res.status(400).send({ message: "product name is required" });
      }
      case !description: {
        return res
          .status(400)
          .send({ message: "product description is required" });
      }
      case !price: {
        return res.status(400).send({ message: "product price is required" });
      }
      case !category: {
        return res.status(400).send({ message: "product name is required" });
      }
      case !quantity: {
        return res
          .status(400)
          .send({ message: "product quantity is required" });
      }
      case photo && photo.size < 5000: {
        return res
          .status(400)
          .send({ message: "Image size should be less than 5Mb" });
      }
    }
    const { id } = req.params;
    const single_product = await productModel.findById(id);
    await cloudinary.uploader.destroy(single_product.cloudinary_id);
    let result;
    if(req.file)
    {
      result = await cloudinary.uploader.upload(req.file.path);
    }
    const product = await productModel.findByIdAndUpdate(id, {
      ...req.body,
      slug: slugify(name),
      photo: result?.secure_url || single_product.photo,
      cloudinary_id: result?.public_id || single_product.cloudinary_id,
    });
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product detail updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating product",
      error,
    });
  }
};

//get all products controller
const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 ,price:1 });
    res.status(201).send({
      success: true,
      message: "All Products",
      total: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting product",
      error,
    });
  }
};

const singleProductController = async (req, res) => {
  try {
    const products = await productModel
      .findOne({ slug: req.params.slug })
      .populate("category")
    res.status(200).send({
      success: true,
      message: "Single Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting single",
      error,
    });
  }
};

const photoProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await productModel.findById(id).select("photo");
    if (products.photo) {
      //res.set("Content-type", products.photo.contentType);
      return res.status(200).send(products.photo);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in showing one photo",
      error,
    });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const {id} = req.params;
    const product= await productModel.findById(id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(product?.cloudinary_id);
    // Delete user from db
    await productModel.findOneAndDelete(id);
    return res.status(200).send({
      success: true,
      message: "Product is deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating procut",
      error,
    });
  }
};

//filter product controller
const productFilterController = async (req, res) => {
  try {
    const {checked,radio} = req.body;
    let args = { };
    if(checked.length > 0)
    {
        args.category = checked;
    }
    if(radio.length)
    {
       args.price = {$gte: radio[0],$lte: radio[1]}
    }
    const products = await productModel.find(args);
    res.status(200).send({
      success:true,
      message:"filtered successful",
      products,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Filter product",
      error,
    });
  }
};

//product sort controller
const sortProductController = async(req,res) =>{
  try {
    let {sort, page ,checked, radio} = req.body;
    const perPage = 6;
    const pages = page ? page :1;
    let args = {};
    if(checked.length > 0)
    {
        args.category = checked;
    }
    if(radio.length)
    {
       args.price = {$gte: radio[0],$lte: radio[1]}
    }
    if(sort === "")
    {
      sort = "price-lowest";
    }
    let products=[];
    let count=0;
    if(sort === "price-lowest")
    {
      const sort_prod = { price: 1,createdAt:-1 };
      count = await productModel.find(args).countDocuments();
      products = await productModel.find(args).skip((pages-1) * perPage).limit(perPage).sort(sort_prod);
    }
    else if(sort === "price-highest")
    {
      const sort_prod = { price: -1,createdAt:-1 };
      count = await productModel.find(args).countDocuments();
      products = await productModel.find(args).skip((pages-1) * perPage).limit(perPage).sort(sort_prod);
    }
    else if(sort === "name-a")
    {
      const sort_prod = { slug: 1,createdAt:-1 };
      count = await productModel.find(args).countDocuments();
      products = await productModel.find(args).skip((pages-1) * perPage).limit(perPage).sort(sort_prod);
    }
    else if(sort === "name-z")
    {
      const sort_prod = { slug: -1,createdAt:-1 };
      count = await productModel.find(args).countDocuments();
      products = await productModel.find(args).skip((pages-1) * perPage).limit(perPage).sort(sort_prod);
    }
    res.status(200).send({
      success:true,
      message:"Sorting successful",
      products,
      count
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Sorting product",
      error,
    });
  }
}

//product count controller
const productCountController = async(req,res) =>{
  try{ 
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success:true,
      total,
    }) 
  } catch{
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Count  product",
      error,
    });
  }
 }

//product list controller
 const productListController = async(req,res) =>{
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page :1;
    const sort_prod = { price: 1,createdAt:-1 };
    const products = await productModel.find({}).skip((page-1) * perPage).limit(perPage).sort(sort_prod);
    res.status(200).send({
      success:true,
      products,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in listing product",
      error,
    });
  }
 }

 //search product controller
 const searchProductController = async(req,res) =>{
   try {
    const {keyword} = req.params;
    const results = await productModel.find({
      $or :[
        {name:{$regex :keyword, $options :"i"}},//options i means case insensitive
        {description:{$regex :keyword, $options :"i"}}
      ]
    })
    res.json(results);
   } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in searching product",
      error,
    });
   }
 }

 //similar products controller
 const relatedProductController = async(req,res) =>{
  try {
   const {pid,cid} = req.params;
   const products = await productModel.find({
     category : cid,
     _id : {$ne :pid} 
   }).limit(3).populate("category");
   res.status(200).send({
    success:true,
    products
   })
  } catch (error) {
   console.log(error);
   res.status(500).send({
     success: false,
     message: "Error in related product",
     error,
   });
  }
}

//category wise product
const categoryProductController = async(req,res) =>{
  try {
   const slug = req.params.slug;
   const category = await categoryModel.findOne({slug:slug});
   const products = await productModel.find({category}).populate("category");
   res.status(200).send({
    success:true,
    category,
    products
   })
  } catch (error) {
   console.log(error);
   res.status(500).send({
     success: false,
     message: "Error in getting category product",
     error,
   });
  } 
}

//payment gateway api  token
const braintreeTokenController = async(req,res) =>{
  try {
    gateway.clientToken.generate({},function(err,response){
      if(err){
        res.status(500).send(err);
      }else{
        res.send(response);
      }
    })
  } catch (error) {
    console.log(error);
  } 
};

//payment
const braintreePaymentController = async(req,res) =>{
  try {
    const {cart,nonce} = req.body;
    let total = 0;
    cart.map( (i) => {total += i.price}); 
     let  newTransaction = gateway.transaction.sale({
      amount:total,
      paymentMethodNonce:nonce,
      options:{
        submitForSettlement:true
      }
     } ,
     function (error,result){
      if(result){
        const  order = new orderModel({
          products:cart,
          payment:result,
          buyer:req.user._id,
        }).save()
        res.json({ok:true})
      } else{
        res.status(500).send(error)
      }
     })
  } catch (error) {
    console.log(error);
  }
}


module.exports = {
  createProductController,
  getProductController,
  singleProductController,
  photoProductController,
  deleteProductController,
  updateProductController,
  productFilterController,
  sortProductController,
  productCountController,
  productListController,
  searchProductController,
  relatedProductController,
  categoryProductController,
  braintreeTokenController,
  braintreePaymentController,
};
