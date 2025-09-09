import { Contact } from "../models/Contact.js";

export const postContact = async (req, res) => {
  try {
    const doc = await Contact.create(req.body);
    return res.status(201).json({
      ok: true,
      msg: "Mensaje enviado correctamente.",
      contact: doc,
    });
  } catch (error) {
    if (error?.name === "ValidationError") {
      return res.status(400).json({
        ok: false,
        msg: "Datos inválidos.",
        errors: error.errors,
      });
    }
    console.error("Error interno:", error);
    return res.status(500).json({ ok: false, msg: "Error de servidor." });
  }
};
