import { model, Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      minlength: 10,
    },
    largeDescription: {
      type: String,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    brand: {
      type: String,
      required: true,
    },
    freeDelivery: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: true,
      enum: ["primeros-juguetes", "vehiculos", "muñecas-accesorios", "didacticos", "aire-libre"],
    },
    ageFrom: {
      type: Number,
      min: 0,
    },
    ageTo: {
      type: Number,
      min: 0,
    },
    ageUnitFrom: {
      type: String,
      enum: ["meses", "años"],
    },
    ageUnitTo: {
      type: String,
      enum: ["meses", "años"],
    },
    deleteAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

ProductSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.id = ret._id; //agrega campo id copiando el valor de _id
    delete ret._id; //elimina el campo original _id
  },
});

export const Products = model("Product", ProductSchema);
