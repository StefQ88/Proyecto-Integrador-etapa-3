import { body, validationResult } from "express-validator";

export const logContact = (req, _res, next) => {
  console.log("POST /api/contact BODY:", req.body);
  next();
};

export const validateRequest = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = {};
  for (const e of result.array()) if (!errors[e.path]) errors[e.path] = e.msg;
  return res.status(400).json({ ok: false, msg: "Datos inválidos", errors });
};

export const contactValidations = [
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("Nombre obligatorio.")
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Nombre: mínimo 2."),
  body("surname")
    .exists({ checkFalsy: true })
    .withMessage("Apellido obligatorio.")
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Apellido: mínimo 2."),
  body("email")
    .exists({ checkFalsy: true })
    .withMessage("Email obligatorio.")
    .isEmail()
    .withMessage("Email inválido.")
    .normalizeEmail(),
  body("reason")
    .exists({ checkFalsy: true })
    .withMessage("Motivo obligatorio.")
    .isIn(["compras-web", "reclamo-producto", "otro"])
    .withMessage("Motivo no permitido."),
  body("body")
    .exists({ checkFalsy: true })
    .withMessage("Comentario obligatorio.")
    .isString()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Comentario: mínimo 10."),
];
