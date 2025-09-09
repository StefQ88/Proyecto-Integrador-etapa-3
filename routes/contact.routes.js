import { Router } from "express";
import { postContact } from "../controllers/contactController.js";
import { contactValidations, validateRequest } from "../middlewares/contactValidations.js";

const route = Router();

route.post("/", contactValidations, validateRequest, postContact);

export default route;
