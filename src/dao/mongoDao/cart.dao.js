import { cartModel } from "../models/cart.models.js";
import { licorModel } from "../models/licores.models.js"; 

const getById = async (id) => {
    const cart = await cartModel.findById(id);
    return cart;
};

const create = async (data) => {
    const cart = await cartModel.create(data);
    return cart;
};

const addLicorToCart = async (cid, lid) => {
    const licor = await licorModel.findById(lid);
    if(!licor) return {
        licor: false
    }

    await cartModel.findByIdAndUpdate(cid, { $push: {licores: licor} });

    const cart = await cartModel.findById(cid);
    if(!cart) return {
        cart: false
    }

    return cart; 
}

export default {
    getById,
    create,
    addLicorToCart
};
