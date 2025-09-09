import { validationResult } from "express-validator";

export const validationErrorResponse = (req, res, next) => {
  //ejecuta validationResult sobre la req, devuelve res con errores si hay
  const errors = validationResult(req);

  //si hay errores
  if (!errors.isEmpty()) {
    const errorList = errors.array().reduce(
      (acc, err) => ({
        ...acc,
        [err.path]: err.msg,
      }),
      {}
    );

    return res.status(400).json({
      ok: false,
      errors: errorList,
    });
  }

  // si no hay errores proximo middleware
  next();
};
