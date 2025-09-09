import mongoose from "mongoose";

export const dbConection = async () => {
  try {
    await mongoose.connect(process.env.BASE_URL_DB);
    console.log("Mongo OK → DB:", mongoose.connection.name);
  } catch (error) {
    console.error("Error al conectar la BD:", error.message);
    throw error;
  }
};
