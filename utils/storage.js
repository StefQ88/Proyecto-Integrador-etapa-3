import multer from "multer";

//guarda los archivos temporales indicando carpeta de destino y nombre del archivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./temp/images");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}.png`); //da milisegundos
  },
});

const upload = multer({ storage });

export default upload;
