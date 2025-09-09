import express from "express";
import { createCart } from "../controllers/cartController.js";
import { createCartRules } from "../middlewares/cartValidations.js";
import { validationErrorResponse } from "../middlewares/validationErrorResponse.js";

const route = express.Router();

route.post("/", createCartRules, validationErrorResponse, createCart);

export default route;
