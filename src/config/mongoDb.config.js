import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://sairesifontes:Fiestalas17K@ecommerce.japcrgv.mongodb.net/coder-bank") 
    console.log("Mongo Conectado");

    } catch (error) {
        console.error("Error al conectar Mongo:", error.message);
    }
};
