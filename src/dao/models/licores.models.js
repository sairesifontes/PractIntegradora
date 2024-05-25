import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const licorCollection = "licores";

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
    required: true 
  }
});

licorSchema.plugin(mongoosePaginate);

export const licorModel = mongoose.model(licorCollection, licorSchema);
