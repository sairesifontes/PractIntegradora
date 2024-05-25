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
  if (!licor) return { licor: false };

  const cart = await cartModel.findById(cid);
  if (!cart) return { cart: false };

  const licorInCart = await cartModel.findOneAndUpdate(
    { _id: cid, "licores.licor": lid },
    { $inc: { "licores.$.quantity": 1 } }
  );

  if (!licorInCart) {
    await cartModel.updateOne(
      { _id: cid },
      { $push: { licores: { licor: lid, quantity: 1 } } }
    );
  }

  const cartUpdate = await cartModel.findById(cid);
  return cartUpdate;
};


const deleteLicorInCart = async (cid, lid) => {
  const licor = await licorModel.findById(lid);
  if (!licor) return { licor: false };

  let cart = await cartModel.findOne({ _id: cid });
  if (!cart) return { cart: false };

  const index = cart.licores.findIndex(item => item.licor.equals(lid));
  if (index === -1) return { cart: false };

  if (cart.licores[index].quantity === 1) {
    // Si la cantidad es 1, eliminar completamente el licor del carrito
    cart = await cartModel.findOneAndUpdate(
      { _id: cid },
      { $pull: { licores: { licor: lid } } },
      { new: true }
    );
  } else {
    // Si la cantidad es mayor que 1, decrementar la cantidad en 1
    cart = await cartModel.findOneAndUpdate(
      { _id: cid, "licores.licor": lid },
      { $inc: { "licores.$.quantity": -1 } },
      { new: true }
    );
  }

  return cart;
};

const update = async (cid, data) => {
  await cartModel.updateOne({ _id: cid }, { $set: { licores: [] } });
  await cartModel.updateOne({ _id: cid }, { $set: { licores: data } });
  const cart = await cartModel.findById(cid);
  return cart;
};

const updateQuantityLicorInCart = async (cid, lid, quantity) => {
  const licor = await licorModel.findById(lid);
  if (!licor) return { licor: false };

  const cart = await cartModel.findOneAndUpdate(
    { _id: cid, "licores.licor": lid },
    { $set: { "licores.$.quantity": quantity } }
  );

  if (!cart) return { cart: false };

  const cartUpdate = await cartModel.findById(cid);
  return cartUpdate;
};

const deleteAllLicoresInCart = async (cid) => {
  const cart = await cartModel.findByIdAndUpdate(cid, { $set: { licores: [] } });
  const cartUpdate = await cartModel.findById(cid);
  return cartUpdate;
};


const deleteCart = async (cid) => {
  try {
    // Buscar y eliminar el carrito por su ID
    const cart = await cartModel.findByIdAndDelete(cid);
    return cart; // Devolver el carrito eliminado, si existe
  } catch (error) {
    throw new Error("Error al eliminar el carrito");
  }
};

export default {
  getById,
  create,
  addLicorToCart,
  deleteLicorInCart,
  update,
  updateQuantityLicorInCart,
  deleteAllLicoresInCart,
  deleteCart,
};
