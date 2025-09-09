import { Cart } from "../models/Cart.js";

export const createCart = async (req, res) => {
  const { body } = req;

  try {
    const cart = await Cart.create(body);

    return res.status(201).json({
      ok: true,
      msg: "Carrito creado correctamente.",
      cart,
    });
  } catch (error) {
    if (error?.name === "ValidationError") {
      return res.status(400).json({
        ok: false,
        msg: "Datos inválidos.",
        errors: error.errors,
      });
    }

    console.log("Error interno:", error);
    res.status(500).json({
      ok: false,
      msg: "Error de servidor.",
    });
  }
};
