import { Schema, model } from "mongoose";

const ImageSchema = new Schema({
  fileName: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    data: Buffer, //guardar la imagen
    contentType: String,
  },
});

export const Images = model("Image", ImageSchema);
