import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConection } from "./database/dbConection.js";

import productsRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import imageRoutes from "./routes/image.routes.js";

const server = express();

const api = async () => {
  dotenv.config();

  await dbConection();

  // MIDDLEWARES
  server.use(express.json()); // para leer json en req.body
  server.use(cors());

  // RUTAS
  server.use("/images", imageRoutes);
  server.use("/api/cart", cartRoutes);
  server.use("/api/contact", contactRoutes);
  server.use("/api/products", productsRoutes);

  // Arranque
  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => console.log("Servidor corriendo en el puerto", PORT));
};

api();
