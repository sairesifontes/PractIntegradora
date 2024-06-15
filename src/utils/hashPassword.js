import bcrypt from "bcrypt";

// Hasheo de contraseñas
export const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Validar la contraseña
export const checkPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};
