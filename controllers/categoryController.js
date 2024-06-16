const categoryModel = require("../models/categoryModel");
const slugify = require("slugify");

const createCategoryController = async(req,res) =>{
      try {
        const {name} = req.body;
        if(!name)
        {
            return res.status(400).send({mesaage:"category name is required"});
        }
        //check for existing category
        const existingCategory = await categoryModel.findOne({name});
        if(existingCategory)
        {
            res.status(200).send({
                success:false,
                message:"Category Already Exists"
             });
        }
        const category = await new categoryModel({name,slug:slugify(name)}).save();
        res.status(201).send({
            success:true,
            message:"Category Added successfully",
            category
        })
        
      } catch (error) {
         console.log(error);
         res.status(500).send({
            success:false,
            message:"Error in create category",
            error
         })
      }
}

//update category

const updateCategoryController = async(req,res) =>{
    try {
      const {name} = req.body;
      const {id} = req.params;
      const category = await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
      res.status(200).send({
        success:true,
        message:"Category updated successfully",
        category
    })
    } catch (error) {
       console.log(error);
       res.status(500).send({
          success:false,
          message:"Error while updating category",
          error
       })
    }
}

//catrgory controller to show all categories
const categoryController = async(req,res) =>{
    try {
      const category = await categoryModel.find({});
      res.status(200).send({
        success:true,
        message:"All categories list",
        category
    })
    } catch (error) {
       console.log(error);
       res.status(500).send({
          success:false,
          message:"Error in showing categories",
          error
       })
    }
}

//single category to show 
const singleCategoryController = async(req,res) =>{
    try {
      const category = await categoryModel.findOne({slug:req.params.slug});
      res.status(200).send({
        success:true,
        message:"Single category data",
        category
    })
    } catch (error) {
       console.log(error);
       res.status(500).send({
          success:false,
          message:"Error in Single category",
          error
       })
    }
}

//delete category controller
const deleteCategoryController = async(req,res) =>{
    try {
        const {id} = req.params;
      await categoryModel.findOneAndDelete(id);
      res.status(200).send({
        success:true,
        message:"category deleted",
    })
    } catch (error) {
       console.log(error);
       res.status(500).send({
          success:false,
          message:"Error in Deleting category",
          error
       })
    }
}

module.exports = {createCategoryController,updateCategoryController,categoryController,singleCategoryController,deleteCategoryController};