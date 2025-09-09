import { Schema, model } from "mongoose";

const ContactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    surname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },
    reason: {
      type: String,
      required: true,
      enum: ["compras-web", "reclamo-producto", "otro"],
    },
    body: { type: String, required: true, trim: true, minlength: 10, maxlength: 5000 },
  },
  { timestamps: true }
);

export const Contact = model("Contact", ContactSchema);
