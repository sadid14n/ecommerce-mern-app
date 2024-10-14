import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  braintreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getProductPhoto,
  getSingelProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  relatedProductController,
  searchProductController,
  updateProductController,
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

// routes

// create product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

// get product
router.get("/get-product", getProductController);

// get singel product
router.get("/get-product/:slug", getSingelProductController);

// get product photo
router.get("/product-photo/:pid", getProductPhoto);

// delete route
router.delete(
  "/delete-product/:pid",
  requireSignIn,
  isAdmin,
  deleteProductController
);

// Update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// filter product
router.post("/product-filters", productFiltersController);

// product count
router.get("/product-count", productCountController);

// product per page
router.get("/product-list/:page", productListController);

// search product
router.get("/search/:keyword", searchProductController);

// releated product
router.get("/related-product/:pid/:cid", relatedProductController);

// category wise product
router.get("/product-category/:slug", productCategoryController);

//payment routes
//token
router.get("/braintree/token", braintreeTokenController);

// payment
router.post("/braintree/payment", requireSignIn, braintreePaymentController);
export default router;
