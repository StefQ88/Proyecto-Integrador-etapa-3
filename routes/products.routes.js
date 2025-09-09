import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductsById,
} from "../controllers/productsController.js";
import { createProductRulesFile, updateProductRules } from "../middlewares/productsValidations.js";
import { validationErrorResponse } from "../middlewares/validationErrorResponse.js";
import upload from "../utils/storage.js";

const route = express.Router();

route
  .get("/", getProducts)
  .get("/:id", getProductsById)
  .post("/", upload.single("image"), createProductRulesFile, validationErrorResponse, createProduct)
  .put("/:id", upload.single("image"), updateProductRules, validationErrorResponse, updateProduct)
  .delete("/:id", deleteProduct);

export default route;
