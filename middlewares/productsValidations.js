// middlewares/productsValidations.js
import { body } from "express-validator";

const allowedCategories = ["primeros-juguetes", "vehiculos", "muñecas-accesorios", "didacticos", "aire-libre"];

// POST /api/products

export const createProductRulesFile = [
  body("name").exists({ checkFalsy: true }).withMessage("Nombre obligatorio.").isString().trim(),
  body("price").exists({ checkFalsy: true }).isFloat({ gt: 0 }).withMessage("Precio debe ser mayor a 0."),
  body("stock").exists({ checkFalsy: true }).isInt({ min: 0 }).withMessage("Stock debe ser ≥ 0."),
  body("brand").exists({ checkFalsy: true }).withMessage("Marca obligatoria.").isString().trim(),
  body("category")
    .exists({ checkFalsy: true })
    .withMessage("Categoría obligatoria.")
    .isIn(allowedCategories)
    .withMessage("Categoría no permitida."),
  body("shortDescription")
    .exists({ checkFalsy: true })
    .withMessage("Descripción corta obligatoria.")
    .isString()
    .isLength({ min: 10 })
    .withMessage("Mínimo 10 caracteres.")
    .trim(),
  body("largeDescription").optional().isString().trim(),
  body("freeDelivery").optional().isBoolean(),

  body("ageFrom").exists({ checkFalsy: true }).isInt({ min: 0 }),
  body("ageUnitFrom").exists({ checkFalsy: true }).isIn(["meses", "años"]),
  body("ageTo").exists({ checkFalsy: true }).isInt({ min: 0 }),
  body("ageUnitTo").exists({ checkFalsy: true }).isIn(["meses", "años"]),

  // Imagen
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ ok: false, errors: { image: "La imagen es obligatoria y debe ser un archivo." } });
    }
    next();
  },

  // Regla ageTo >= ageFrom
  body().custom((val = {}) => {
    const { ageFrom, ageTo } = val;
    if (ageFrom !== undefined && ageTo !== undefined && Number(ageTo) < Number(ageFrom)) {
      throw new Error("La edad máxima no puede ser menor que la mínima.");
    }
    return true;
  }),
];

// PUT /api/products/:id
export const updateProductRules = [
  body("name").optional().isString().trim(),
  body("price").optional().isFloat({ gt: 0 }).withMessage("Precio debe ser mayor a 0."),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock debe ser ≥ 0."),
  body("brand").optional().isString().trim(),
  body("category").optional().isIn(allowedCategories).withMessage("Categoría no permitida."),
  body("shortDescription").optional().isString().isLength({ min: 10 }).withMessage("Mínimo 10 caracteres.").trim(),
  body("largeDescription").optional().isString().trim(),
  body("freeDelivery").optional().isBoolean(),
  body("ageFrom").optional().isInt({ min: 0 }),
  body("ageUnitFrom").optional().isIn(["meses", "años"]),
  body("ageTo").optional().isInt({ min: 0 }),
  body("ageUnitTo").optional().isIn(["meses", "años"]),

  body().custom((val = {}) => {
    const { ageFrom, ageTo } = val;
    if (ageFrom !== undefined && ageTo !== undefined && Number(ageTo) < Number(ageFrom)) {
      throw new Error("La edad máxima no puede ser menor que la mínima.");
    }
    return true;
  }),
];
