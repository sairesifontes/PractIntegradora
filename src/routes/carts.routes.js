import { Router } from "express";
import cartDao from "../dao/mongoDao/cart.dao.js";
const router = Router();

router.post("/", async (req, res) => {
  try {
    const cart = await cartDao.create();

    res.status(201).json({status: "success", payload: cart});
  } catch (error) {
    console.error(error);
    res.status(500).json({status: "error", message: "Ocurrió un error al crear el carrito."});
  }
});

router.post("/:cid/licor/:lid", async (req, res) => {
try {
    const {cid, lid} = req.params;
    const cart = await cartDao.addLicorToCart(cid, lid);

    if(cart.licor == false) return res.status(404).json({status: "Error", message: `No se encontró el licor con el id ${lid}`});
    if(cart.cart == false) return res.status(404).json({status: "Error", message: `No se encontró el carrito con el id ${cid}`});

    res.status(200).json({status: "success", payload: cart});

} catch (error) {
    console.error(error);
    res.status(500).json({status: "error", message: "Ocurrió un error al agregar el licor al carrito."});
}
});

router.get("/:cid", async (req, res) => {
  try {
    const {cid} = req.params;
    const cart = await cartDao.getById(cid);
    if(!cart) return res.status(404).json({status: "Error", message: `No se encontró el carrito con el id ${cid}`});

    res.status(200).json({status: "success", payload: cart});
  } catch (error) {
    console.error(error);
    res.status(500).json({status: "error", message: "Ocurrió un error al obtener el carrito."});
  }
});

export default router;
