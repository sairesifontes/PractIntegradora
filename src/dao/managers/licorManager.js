import fs from "fs";

let licores = [];
const pathFile = "./src/dao/managers/data/licores.json";

const loadLicores = async () => {
  try {
    const licoresJson = await fs.promises.readFile(pathFile);
    licores = JSON.parse(licoresJson) || [];
  } catch (error) {
    console.error("Error al cargar los licores:", error);
  }
};

const saveLicores = async () => {
  try {
    await fs.promises.writeFile(pathFile, JSON.stringify(licores));
  } catch (error) {
    console.error("Error al guardar los licores:", error);
  }
};

const getLicores = async (limit) => {
  try {
    await loadLicores();
    if (!limit) return licores;
    return licores.slice(0, limit);
  } catch (error) {
    console.error("Error al obtener los licores:", error);
    throw error;
  }
};

const getLicorById = async (id) => {
  try {
    await loadLicores();
    const licor = licores.find((licor) => licor.id === id);
    if (!licor) {
      console.error(`No se encontró el licor con el id ${id}`);
      return;
    }
    return licor;
  } catch (error) {
    console.error(`Error al obtener el licor con el id ${id}:`, error);
    throw error;
  }
};

const addLicor = async (licor) => {
  try {
    await loadLicores();
    licores.push(licor);
    await saveLicores();
    return licor;
  } catch (error) {
    console.error("Error al agregar un nuevo licor:", error);
    throw error;
  }
};

const updateLicor = async (id, newData) => {
  try {
    await loadLicores();
    const index = licores.findIndex((licor) => licor.id === id);
    if (index === -1) {
      console.error(`No se encontró el licor con el id ${id}`);
      return;
    }
    licores[index] = { ...licores[index], ...newData };
    await saveLicores();
    return licores[index];
  } catch (error) {
    console.error(`Error al actualizar el licor con el id ${id}:`, error);
    throw error;
  }
};

const deleteLicor = async (id) => {
  try {
    await loadLicores();
    licores = licores.filter((licor) => licor.id !== id);
    await saveLicores();
  } catch (error) {
    console.error(`Error al eliminar el licor con el id ${id}:`, error);
    throw error;
  }
};

export default {
  getLicores,
  getLicorById,
  addLicor,
  updateLicor,
  deleteLicor,
};
