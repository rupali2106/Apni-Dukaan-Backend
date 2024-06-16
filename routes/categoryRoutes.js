const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const {createCategoryController,updateCategoryController,categoryController,singleCategoryController,deleteCategoryController} = require("../controllers/categoryController");

const router = express.Router();

//routes
router.post("/create-category",requireSignIn,isAdmin,createCategoryController);

//udate category route
router.put("/update-category/:id",requireSignIn,isAdmin,updateCategoryController);

//all categories
router.get("/get-category",categoryController);

//single category
router.get("/single-category/:slug",singleCategoryController);

//delete category
router.delete("/delete-category/:id",requireSignIn,isAdmin,deleteCategoryController)


module.exports = router;