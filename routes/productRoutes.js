const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const {
  createProductController,
  getProductController,
  singleProductController,
  photoProductController,
  deleteProductController,
  updateProductController,
  productFilterController,
  productCountController,
  productListController,
  searchProductController,
  relatedProductController,
  categoryProductController,
  braintreeTokenController,
  braintreePaymentController,
  sortProductController,
} = require("../controllers/productController");
const upload = require("../utils/multer");


const router = express.Router();

//routes

//create-product route
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  upload.single("photo"),
  createProductController
);

//update product
router.put(
  "/update-product/:id",
  requireSignIn,
  isAdmin,
  upload.single("photo"),
  updateProductController
);

//get all products
router.get("/get-product", getProductController);

//get single product
router.get("/single-product/:slug", singleProductController);

//get photo
router.get("/photo-product/:id", photoProductController);

//delete product
router.delete(
  "/delete-product/:id",
  requireSignIn,
  isAdmin,
  deleteProductController,
);

//filter product
router.post("/filter-product", productFilterController);

//sort product
router.post("/sort-product",sortProductController);

//product count route
router.get("/count-product", productCountController);

//product per page
router.get("/list-product/:page",productListController);

//product  search product
router.get("/search-product/:keyword",searchProductController);

//similar products route
router.get("/related-product/:pid/:cid",relatedProductController);

//categorywise product
router.get("/category-product/:slug",categoryProductController);

//payment route
//token
router.get("/braintree/token", braintreeTokenController);

//payment routes
router.post("/braintree/payment", requireSignIn,braintreePaymentController)

module.exports = router;
