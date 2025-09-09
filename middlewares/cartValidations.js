import { body } from "express-validator";

export const createCartRules = [
  body("cart").isArray({ min: 1 }).withMessage("'cart' debe ser un array con al menos 1 item.").bail(),

  body("cart.*.productId").isMongoId().withMessage("productId inválido."),

  body("cart.*.name").trim().notEmpty().withMessage("name es requerido."),

  body("cart.*.price").isFloat({ gt: 0 }).withMessage("price debe ser > 0").toFloat(),

  body("cart.*.quantity")
    .optional()
    .toInt()
    .customSanitizer((v) => (Number.isFinite(v) && v >= 1 ? v : 1)),

  body("cart.*.image").optional({ nullable: true }).isString().withMessage("image debe ser un string"),
];
