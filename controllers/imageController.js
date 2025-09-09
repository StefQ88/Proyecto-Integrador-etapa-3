import { Images } from "../models/Images.js";

export const getImage = async (req, res) => {
  try {
    const { idImage } = req.params;
    const doc = await Images.findById(idImage); //buscamos la imagen

    if (!doc || !doc.image || !doc.image.data) {
      //si no la encuentra
      return res.sendStatus(404);
    }

    const buffer = doc.image.data; //rearmamos el buffer
    const type = doc.image.contentType;

    //encabezado
    res.writeHead(200, {
      "Content-Type": type, //tipo
      "Content-Length": buffer.length,
    });
    return res.end(buffer);
  } catch (error) {
    console.error("GET /images/:idImage error:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error de servidor.",
    });
  }
};
