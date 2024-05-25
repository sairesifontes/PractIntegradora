import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  licores: [
    {
      licor: { type: mongoose.Schema.Types.ObjectId, ref: "Licor" },
      quantity: { type: Number, default: 1 },
    },
  ],
});

cartSchema.pre("find", function () {
  this.populate("licores.licor");
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
