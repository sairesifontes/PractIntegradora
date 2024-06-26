import { Router } from "express";
import cartDao from "../dao/mongoDao/cart.dao.js";
const router = Router();

router.post("/", async (req, res) => {
  try {
    const cart = await cartDao.create();

    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.post("/:cid/licor/:lid", async (req, res) => {
  try {
    const { cid, lid } = req.params;
    const cart = await cartDao.addLicorToCart(cid, lid);
    
    if (cart.licor == false) return res.status(404).json({ status: "Error", msg: `No se encontró el licor con el id ${lid}` });
    if (cart.cart == false) return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el id ${cid}` });

    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.put("/:cid/licor/:lid", async (req, res) => {
  try {
    const { cid, lid } = req.params;
    const { quantity } = req.body;
    
    const cart = await cartDao.updateQuantityLicorInCart(cid, lid, quantity);
    if (cart.licor == false) return res.status(404).json({ status: "Error", msg: `No se encontró el licor con el id ${lid}` });
    if (cart.cart == false) return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el id ${cid}` });

    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.delete("/:cid/licor/:lid", async (req, res) => {
  try {
    const { cid, lid } = req.params;
    const cart = await cartDao.deleteLicorInCart(cid, lid);
    if (cart.licor == false) return res.status(404).json({ status: "Error", msg: `No se encontró el licor con el id ${lid}` });
    if (cart.cart == false) return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el id ${cid}` });

    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartDao.getById(cid);
    if (!cart) return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el id ${cid}` });

    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const body = req.body;

    const cart = await cartDao.update(cid, body);
    if (!cart) return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el id ${cid}` });
    
    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartDao.deleteAllLicoresInCart(cid);
    if (!cart) return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el id ${cid}` });
    
    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});


export default router;
