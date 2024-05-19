import { Router } from "express";
import licoresRouters from "./licores.routes.js";
import cartsRouters from "./carts.routes.js";
const router = Router();

router.use("/licores", licoresRouters);
router.use("/carts", cartsRouters);

export default router;
