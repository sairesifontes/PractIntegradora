import jwt from "jsonwebtoken";

// Crear el token
export const generateToken = (user) => {
  const { _id, email } = user;
  const token = jwt.sign({ _id, email }, "codigoSecreto", { expiresIn: "1h" });
  return token;
};

// Verificar el token
export const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, "codigoSecreto");
    return decoded;
  } catch (error) {
    return null;
  }
};
