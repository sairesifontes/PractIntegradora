import { request, response } from "express";

export const checkLogin = async (req = request, res = response, next) => {
  if (req.session.user) {
    return next();
  } else {
    return res.status(401).json({ status: "Error", message: "Usuario no logueado" });
  }
};
