import { Router } from "express";
import licoresRouters from "./licores.routes.js";
import cartsRouters from "./carts.routes.js";
import sessionRouters from "./session.routes.js"
import { checkLogin } from "../middlewares/login.middleware.js"
const router = Router();



router.use("/licores", checkLogin, licoresRouters);
router.use("/carts", cartsRouters);
router.use("/session", sessionRouters)

export default router;
