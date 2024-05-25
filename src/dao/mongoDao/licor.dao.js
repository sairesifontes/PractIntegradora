import { licorModel } from "../models/licores.models.js";

const getAll = async (query, options) => {
  const licores = await licorModel.paginate(query, options);
  return licores;
};

const getById = async (id) => {
  const licor = await licorModel.findById(id);
  return licor;
};

const create = async (data) => {
  const licor = await licorModel.create(data);
  return licor;
};

const update = async (id, data) => {
  await licorModel.findByIdAndUpdate(id, data);
  const licor = await licorModel.findById(id);
  return licor;
};

const deleteOne = async (id) => {
  const licor = await licorModel.deleteOne({ _id: id });
  if (licor.deletedCount === 0) return false;
  return true;
};

export default {
  getAll,
  getById,
  create,
  update,
  deleteOne,
};
