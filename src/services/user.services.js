import userDAO from "../dao/user.dao.js";

const registerUser = async (userData) => {
  if (!userData.name || !userData.lastName) {
    throw new Error('El nombre y el apellido son obligatorios');
  }
  return await userDAO.create(userData);
};

const getUser = async (query) => {
  return await userDAO.getOne(query);
};

export default { registerUser, getUser };