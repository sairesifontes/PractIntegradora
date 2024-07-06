import accountDAO from "../dao/account.dao.js";
import movementDAO from "../dao/movement.dao.js";

const getAccount = async (query) => {
  return await accountDAO.getOne(query);
};

const createAccount = async (userData) => {
  console.log(userData); // Verifica qué datos tiene `userData` aquí

  const { firstName, surname, _id = null } = userData;
  
  // Verifica si firstName y surname son undefined antes de utilizarlos
  const namePart = firstName ? firstName.toLowerCase() : '';
  const lastNamePart = surname ? surname.toLowerCase() : '';
  
  const accountNumber = Math.floor(Math.random() * 1000000000);
  const alias = `${namePart}.${lastNamePart}.${accountNumber.toString().slice(-4)}`;
  
  const accountData = {
    alias,
    number: accountNumber.toString(),
    userId: _id,
  };
  
  return await accountDao.create(accountData);
};





const updateAccount = async (accountId, accountData) => {
  return await accountDAO.update(accountId, accountData);
};

const depositAccount = async (query, amount) => {
  const account = await accountDAO.getOne(query);
  await movementDAO.create({ amount, type: "deposit", originAccountId: account._id, userId: account.userId });
  const updatedAccount = await accountDAO.update(account._id, { balance: account.balance + amount });
  return updatedAccount;
};

const extractAccount = async (query, amount) => {
  const account = await accountDAO.getOne(query);
  await movementDAO.create({ amount: amount * -1, type: "extract", originAccountId: account._id, userId: account.userId });
  const updatedAccount = await accountDAO.update(account._id, { balance: account.balance - amount });
  return updatedAccount;
};

const transferBalance = async (originQuery, destinationQuery, amount, description) => {
  const originAccount = await accountDAO.getOne(originQuery);
  const destinationAccount = await accountDAO.getOne(destinationQuery);

  await movementDAO.create({
    amount: amount * -1,
    type: "transfer",
    userId: originAccount.userId,
    originAccountId: originAccount._id,
    destinationAccountId: destinationAccount._id,
    description
  });

  await movementDAO.create({
    amount,
    type: "transfer",
    userId: destinationAccount.userId,
    originAccountId: originAccount._id,
    destinationAccountId: destinationAccount._id,
    description
  });

  const updatedOrigin = await accountDAO.update(originAccount._id, { balance: originAccount.balance - amount });
  const updatedDestination = await accountDAO.update(destinationAccount._id, { balance: destinationAccount.balance + amount });

  return { originAccount: updatedOrigin, destinationAccount: updatedDestination };
};

export default {
  createAccount,
  updateAccount,
  depositAccount,
  getAccount,
  extractAccount,
  transferBalance
};
