import fs from "fs";
import { Products } from "../models/Products.js";
import { Images } from "../models/Images.js";

export const createProduct = async (req, res) => {
  // console.log("body", req.body)
  // console.log("file ", req.file)
  const { body, file } = req; //desestructuramos el body de la request

  try {
    //valida el archivo, si no vino, corto
    if (!file) {
      return res.status(400).json({
        ok: false,
        msg: "La imagen no se guardó correctamente.",
      });
    }

    // valida producto duplicado por nombre
    const prod = await Products.findOne({ name: body.name });

    if (prod) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un producto con este nombre.",
      });
    }

    // leo archivo temporal de la carpeta, devuelve buffer con los bytes de la imagen
    const imageBuffer = fs.readFileSync(file.path);

    //crea doc en la coleccion de imagenes: fileName, image.data, image.contentType
    const image = await Images.create({
      fileName: file.filename,
      image: {
        data: imageBuffer,
        contentType: file.mimetype,
      },
    });

    // si no se creo, corto
    if (!image) {
      return res.status(400).json({
        ok: false,
        msg: "La imagen no se guardó correctamente.",
      });
    }

    //crea producto con todos los campos del body y seteo image
    const newProd = await Products.create({
      ...body,
      image: `/images/${image._id}`, //endpoint
    });

    // elimino el archivo temporal del disco
    fs.rm(file.path, (error) => {
      if (error) console.log("No se pudo eliminar la imagen temporal:", error.message);
    });

    //respuesta de exito al crear producto
    return res.json(201)({
      ok: true,
      msg: "Producto creado correctamente.",
      product: newProd,
    });
  } catch (error) {
    console.log("Error interno:", error);
    res.status(500).json({
      ok: false,
      msg: "Error de servidor.",
    });
  }
};

export const getProducts = async (req, res) => {
  const { query } = req; //filtros/pageNumber, documentsPerPage

  // paginacion
  const documentsPerPage = parseInt(query.documentsPerPage) || 20;

  //limita el primer documento desde donde arranca
  // primer pagina del 0 al limite 10
  const skip = ((parseInt(query.pageNumber) || 1) - 1) * documentsPerPage;

  try {
    //filtro por nombre
    const queryRegExp = query.name ? { name: new RegExp(query.name, "i") } : undefined;

    // total de doc, para calcular el total de paginas
    const totalDocs = await Products.countDocuments({
      ...queryRegExp,
      deleteAt: { $in: [null, undefined] },
    });

    //seleccion de productos con el filtro y paginacion
    const products = await Products.find({
      ...queryRegExp,
      deleteAt: { $in: [null, undefined] },
    })

      //paginacion
      .skip(skip)
      .limit(documentsPerPage);

    //base para url absolutas
    const BASE = (process.env.BASE_URL_API || `${req.protocol}://${req.get("host")}`).replace(/\/+$/, "");
    const productsWithImageURL = products.map(({ _doc }) => ({
      ..._doc,
      image: _doc.image && !_doc.image.startsWith("http") ? `${BASE}${_doc.image}` : _doc.image,
    }));

    //devuelvo productos
    res.json({
      ok: true,
      products: productsWithImageURL,
      pageNumber: parseInt(query.pageNumber) || 1,
      totalPages: Math.ceil(totalDocs / documentsPerPage), //redondeo la pagina hacia arriba
    });
  } catch (error) {
    console.log("Error interno: ", error);
    res.status(500).json({
      ok: false,
      msg: "Error de servidor.",
    });
  }
};

export const getProductsById = async (req, res) => {
  const { id } = req.params;

  try {
    const prod = await Products.findById(id); //busco en base

    if (!prod || prod.deleteAt) {
      return res.status(404).json({
        ok: false,
        msg: "El producto no existe.",
      });
    }

    //armo la base para ocnvertir la imagen a url
    const BASE = (process.env.BASE_URL_API || `${req.protocol}://${req.get("host")}`).replace(/\/+$/, "");

    const product = {
      ...prod.toObject(),
      image: prod.image && !prod.image.startsWith("http") ? `${BASE}${prod.image}` : prod.image,
    };

    //devuelvo el producto
    return res.json({
      ok: true,
      product,
    });
  } catch (error) {
    console.log("Error interno:", error);
    res.status(500).json({
      ok: false,
      msg: "Error del servidor.",
    });
  }
};

export const updateProduct = async (req, res) => {
  //id de params y el body con los cambios
  const {
    params: { id },
    body,
  } = req;

  try {
    //verifico si existe y no sea soft delete
    const existProduct = await Products.findById(id);

    if (!existProduct || existProduct.deleteAt) {
      return res.status(404).json({
        ok: false,
        msg: "El producto no existe.",
      });
    }

    //actualizo con las validaciones del esquema
    const newProduct = await Products.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    //respuesta
    res.json({
      ok: true,
      msg: "Producto modificado correctamente.",
      product: newProduct,
    });
  } catch (error) {
    if (error?.name === "CastError") {
      return res.status(400).json({
        ok: false,
        msg: "ID inválido.",
      });
    }

    if (error?.name === "ValidationError") {
      return res.status(400).json({
        ok: false,
        msg: "Datos inválidos.",
        errors: error.errors,
      });
    }

    console.log("Error interno: ", error);
    res.status(500).json({
      ok: false,
      msg: "Error de servidor.",
    });
  }
};

export const deleteProduct = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    //verifico si existe y no este eliminado
    const existProduct = await Products.findById(id);

    if (!existProduct || existProduct.deleteAt) {
      return res.status(404).json({
        ok: false,
        msg: "El producto no existe.",
      });
    }

    //deleteAT con la fecha actual
    await Products.findByIdAndUpdate(id, { deleteAt: new Date() }, { new: true });

    //respuesta
    res.json({
      ok: true,
      msg: "Producto eliminado correctamente.",
    });
  } catch (error) {
    if (error?.name === "CastError")
      return res.status(400).json({
        ok: false,
        msg: "ID inválido.",
      });
    console.log("Error interno: ", error);
    res.status(500).json({
      ok: false,
      msg: "Error de servidor.",
    });
  }
};
