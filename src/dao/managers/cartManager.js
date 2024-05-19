import fs from "fs";

let carts = [];
const pathFile = "./src/data/carts.json";

const loadCarts = async () => {
  try {
    const cartsJson = await fs.promises.readFile(pathFile);
    carts = JSON.parse(cartsJson) || [];
  } catch (error) {
    console.error("Error al cargar los carritos:", error);
  }
};

const saveCarts = async () => {
  try {
    await fs.promises.writeFile(pathFile, JSON.stringify(carts));
  } catch (error) {
    console.error("Error al guardar los carritos:", error);
  }
};

const createCart = async () => {
  try {
    const newCart = { id: generateId(), products: [] };
    carts.push(newCart);
    await saveCarts();
    return newCart;
  } catch (error) {
    console.error("Error al crear un nuevo carrito:", error);
    throw error;
  }
};

const addLicorToCart = async (cartId, licorId, quantity = 1) => {
  try {
    await loadCarts();
    const cartIndex = carts.findIndex((cart) => cart.id === cartId);
    if (cartIndex === -1) {
      console.error(`No se encontró el carrito con el ID ${cartId}`);
      return;
    }

    const existingProductIndex = carts[cartIndex].products.findIndex(
      (product) => product.id === licorId
    );
    if (existingProductIndex !== -1) {
      carts[cartIndex].products[existingProductIndex].quantity += quantity;
    } else {
      carts[cartIndex].products.push({ id: licorId, quantity });
    }

    await saveCarts();
    return carts[cartIndex];
  } catch (error) {
    console.error(
      `Error al agregar un licor al carrito con el ID ${cartId}:`,
      error
    );
    throw error;
  }
};

const getCartById = async (cartId) => {
  try {
    await loadCarts();
    const cart = carts.find((cart) => cart.id === cartId);
    if (!cart) {
      console.error(`No se encontró el carrito con el ID ${cartId}`);
      return;
    }
    return cart;
  } catch (error) {
    console.error(`Error al obtener el carrito con el ID ${cartId}:`, error);
    throw error;
  }
};

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export default {
  createCart,
  addLicorToCart,
  getCartById,
};
