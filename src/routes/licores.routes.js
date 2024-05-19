import { Router } from "express";
import licorDao from "../dao/mongoDao/licor.dao.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const licores = await licorDao.getAll();

    res.status(200).json({ status: "success", payload: licores });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Ocurrió un error al obtener los licores." });
  }
});

router.get("/:lid", async (req, res) => {
  try {
    const { lid } = req.params;

    const licor = await licorDao.getById(lid);
    if (!licor) return res.status(404).json({ status: "Error", message: `Licor con el id ${lid} no encontrado` });

    res.status(200).json({ status: "success", payload: licor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Ocurrió un error al obtener el licor." });
  }
});

router.post("/", async (req, res) => {
  try {
    const licor = req.body;
    const newLicor = await licorDao.create(licor);

    res.status(200).json({ status: "success", payload: newLicor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Ocurrió un error al crear el licor." });
  }
});

router.put("/:lid", async (req, res) => {
  try {
    const { lid } = req.params;
    const licorData = req.body;

    const updatedLicor = await licorDao.update(lid, licorData);
    if (!updatedLicor) return res.status(404).json({ status: "Error", message: `Licor con el id ${lid} no encontrado` });

    res.status(200).json({ status: "success", payload: updatedLicor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Ocurrió un error al actualizar el licor." });
  }
});

router.delete("/:lid", async (req, res) => {
  try {
    const { lid } = req.params;
    const deletedLicor = await licorDao.deleteOne(lid);
    if (!deletedLicor) return res.status(404).json({ status: "Error", message: `Licor con el id ${lid} no encontrado` });

    res.status(200).json({ status: "success", message: "Licor eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Ocurrió un error al eliminar el licor." });
  }
});

export default router;
