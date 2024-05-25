import mongoose from "mongoose";

const urlDb = "mongodb+srv://sairesifontes:Fiestalas17K@ecommerce.japcrgv.mongodb.net/ecommerce";

export const connectMongoDB = async () => {
try {
    // Conexión con la base de datos
    mongoose.connect(urlDb);
    console.log("MongoDB Conectado");
} catch (error) {
        console.error("Error al conectar con MongoDB:", error);
    }
};
