import { request, response } from "express";
import Joi from "joi";

export const validateLogin = async (req = request, res = response, next) => {
  try {
    const loginSchema = Joi.object({
      emailAddress: Joi.string().email().required().messages({
        "string.email": "Debe ser un correo electrónico válido",
        "any.required": "El correo electrónico es obligatorio"
      }),
      userPassword: Joi.string().min(3).required().messages({
        "string.min": "Debe tener al menos 3 caracteres",
        "any.required": "La contraseña es obligatoria"
      })
    });

    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    next();
  } catch (err) {
    console.log(`Error: ${err.message}`);
    res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
};
