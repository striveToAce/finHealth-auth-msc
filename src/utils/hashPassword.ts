import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  const hashedPwrd = await bcrypt.hash(password, 10);
  return hashedPwrd;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
};