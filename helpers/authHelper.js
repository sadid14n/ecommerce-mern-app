import bcrypt from "bcryptjs";

export const createHashPassword = async (password) => {
  try {
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

export const checkHashPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
