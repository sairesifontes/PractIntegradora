import mongoose from "mongoose";

const licorCollection = "licores"

const licorSchema = new mongoose.Schema({
nombre: { 
    type: String, 
    required: true 
},
precio: { 
    type: Number, 
    required: true 
},
categoria: { 
    type: String, 
    required: true 
},
contenidoMl: { 
    type: Number, 
    required: true 
},
imagen: { 
    type: String, 
    required: true }
});

export const licorModel = mongoose.model(licorCollection, licorSchema);
