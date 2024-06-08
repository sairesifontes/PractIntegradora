import { Router } from "express";
import licorDao from "../dao/mongoDao/licor.dao.js";
import { checkLogin } from "../middlewares/login.middleware.js";

const router = Router();

router.get("/", checkLogin, async (req, res) => {
  try {
    const { limit, page, sort, category, status } = req.query;
    const options = {
      limit: limit || 10,
      page: page || 1,
      sort: {
        price: sort === "asc" ? 1 : -1,
      },
      lean: true,
    };

    if (status) {
      const licores = await licorDao.getAll({ status: status }, options);
      return res.status(200).json({ status: "success", payload: licores });
    }

    if (category) {
      const licores = await licorDao.getAll({ categoria: category }, options);
      return res.status(200).json({ status: "success", payload: licores });
    }

    const licores = await licorDao.getAll({}, options);

    res.status(200).json({ status: "success", payload: licores });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.get("/:lid", async (req, res) => {
  try {
    const { lid } = req.params;

    const licor = await licorDao.getById(lid);
    if (!licor) {
      return res.status(404).json({ status: "Error", msg: `Licor con el id ${lid} no encontrado` });
    }

    res.status(200).json({ status: "success", payload: licor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.post("/", async (req, res) => {
  try {
    const licor = req.body;
    const newLicor = await licorDao.create(licor);

    res.status(201).json({ status: "success", payload: newLicor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.put("/:lid", async (req, res) => {
  try {
    const { lid } = req.params;
    const licorData = req.body;

    const updateLicor = await licorDao.update(lid, licorData);
    if (!updateLicor) {
      return res.status(404).json({ status: "Error", msg: `Licor con el id ${lid} no encontrado` });
    }

    res.status(200).json({ status: "success", payload: updateLicor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.delete("/:lid", async (req, res) => {
  try {
    const { lid } = req.params;
    const licor = await licorDao.deleteOne(lid);
    if (!licor) {
      return res.status(404).json({ status: "Error", msg: `Licor con el id ${lid} no encontrado` });
    }

    res.status(200).json({ status: "success", payload: "Licor eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});

export default router;
