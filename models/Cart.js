import { model, Schema } from "mongoose";

const cartProduct = {
  productId: {
    type: Schema.Types.ObjectId, //id del producto en la base
    ref: "Products", //modelo de productos
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },

  name: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
};

const CartSchema = new Schema(
  {
    cart: {
      type: [cartProduct], //array de objetos
      required: true,
    },
  },
  { timestamps: true }
);

export const Cart = model("Cart", CartSchema);
