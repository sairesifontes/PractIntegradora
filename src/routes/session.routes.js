// // import express from "express";
// // import { Router } from "express";
// // import userDao from "../dao/mongoDao/user.dao.js";

// // const router = Router();

// // router.post("/register", async (req, res) => {
// //   try {
// //     const userDetails = req.body;
// //     const createdUser = await userDao.createUser(userDetails);
// //     if (!createdUser) return res.status(400).json({ status: "Error", message: "No se pudo registrar el usuario" });

// //     res.status(201).json({ status: "success", data: createdUser });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ status: "Error", message: "Error interno del servidor" });
// //   }
// // });

// // router.post("/login", async (req, res) => {
// //   try {
// //     const { email, password } = req.body;

// //     if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
// //       req.session.user = {
// //         email,
// //         role: "admin",
// //       };
// //       return res.status(200).json({ status: "success", data: req.session.user });
// //     }

// //     const user = await userDao.getByEmail(email);
// //     if (!user || user.password !== password) {
// //       return res.status(401).json({ status: "Error", message: "Email o contraseña incorrectos" });
// //     }

// //     req.session.user = {
// //       email,
// //       role: "user",
// //     };

// //     res.status(200).json({ status: "success", data: req.session.user });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ status: "Error", message: "Error interno del servidor" });
// //   }
// // });

// // router.get("/logout", async (req, res) => {
// //   try {
// //     req.session.destroy();
// //     res.status(200).json({ status: "success", message: "Sesión cerrada exitosamente" });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ status: "Error", message: "Error interno del servidor" });
// //   }
// // });

// // export default router;


// // session.routes.js

// import express from "express";
// import { Router } from "express";
// import userDao from "../dao/mongoDao/user.dao.js";

// const router = Router();

// router.post("/register", async (req, res) => {
//   try {
//     const userData = req.body;
//     const newUser = await userDao.create(userData);
//     if (!newUser) return res.status(400).json({ status: "Error", msg: "No se pudo crear el usuario" });

//     res.status(201).json({ status: "success", payload: newUser });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ status: "Error", msg: "Internal Server Error" });
//   }
// });

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Verificar si el usuario es administrador
//     if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
//       req.session.user = {
//         email,
//         role: "admin",
//       };
//       return res.status(200).json({ status: "success", payload: req.session.user });
//     }

//     // Si no es administrador, buscar al usuario por su correo electrónico
//     const user = await userDao.getByEmail(email);
//     if (!user || user.password !== password) {
//       return res.status(401).json({ status: "Error", msg: "Email o contraseña no válidos" });
//     }

//     req.session.user = {
//       email,
//       role: "user",
//     };

//     res.status(200).json({ status: "success", payload: req.session.user });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ status: "Error", msg: "Internal Server Error" });
//   }
// });

// router.get("/logout", async (req, res) => {
//   try {
//     req.session.destroy();

//     res.status(200).json({ status: "success", msg: "Sesión cerrada con éxito" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ status: "Error", msg: "Internal Server Error" });
//   }
// });

// export default router;


import { Router } from "express";
import passport from "passport";
import userDao from "../dao/mongoDao/user.dao.js";
import { generateToken, validateToken } from "../utils/jwt.js";
import { checkPassword } from "../utils/hashPassword.js";

const router = Router();

router.post("/register", passport.authenticate("register"), async (req, res) => {
  try {
    res.status(201).json({ status: "success", msg: "Usuario Creado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal Server Error" });
  }
});

router.post("/login", passport.authenticate("login"), async (req, res) => {
  try {
    return res.status(200).json({ status: "success", payload: req.user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal Server Error" });
  }
});

router.post("/jwt", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userDao.getByEmail(email);
    if (!user || !checkPassword(user, password)) return res.status(401).json({ status: "error", msg: "usuario o contraseña no válido" });

    const token = generateToken(user);
    // Guardamos el token en una cookie
    res.cookie("token", token, { httpOnly: true });
    return res.status(200).json({ status: "success", payload: user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal Server Error" });
  }
});

router.get("/current", (req, res) => {
  try {
    const token = req.cookies.token;
    const checkToken = validateToken(token);
    if (!checkToken) return res.status(403).json({ status: "error", msg: "Invalid token" });

    return res.status(200).json({ status: "success", payload: checkToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal Server Error" });
  }
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"],
    session: false,
  }),
  async (req, res) => {
    try {
      return res.status(200).json({ status: "success", payload: req.user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "Error", msg: "Internal Server Error" });
    }
  }
);

router.get("/logout", async (req, res) => {
  try {
    req.session.destroy();

    res.status(200).json({ status: "success", msg: "Sesión cerrada con éxito" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal Server Error" });
  }
});

export default router;

