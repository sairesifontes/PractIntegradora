import { Router } from "express";
import userEndpoints from "./user.routes.js";
import accountEndpoints from "./account.routes.js";
import movementEndpoints from "./movement.routes.js";

const router = Router();

router.use("/user", userEndpoints);
router.use("/account", accountEndpoints);
router.use("/movement", movementEndpoints);

export default router;

