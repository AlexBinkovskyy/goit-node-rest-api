import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { SECRET_KEY } from "../app.js";

const hashPassword = (pass) => bcrypt.hash(pass, 10);

const comparePass = async (pass, hashPass) =>
  await bcrypt.compare(pass, hashPass);

const createToken = (id) => {
  return jwt.sign({ id }, SECRET_KEY, { expiresIn: "24h" });
};

export const verifyToken = async (token) => {
  return jwt.verify(token, SECRET_KEY);
};

export const compareTokens = (userToken, dbToken) => {
  return userToken === dbToken ? true : false;
};

export const checkUserByEmail = async ({email}) => {
  return await User.findOne({ email }, { password: 1, email: 1 });
};

export const getUserById = async (id, value = 0) => {
  return await User.findById(id, {password: value});
};

export const checkUserCreds = async (creds) => {
  const result = await checkUserByEmail(creds, 1);
  if (!result) return false;
  const comparepass = await comparePass(creds.password, result.password);
  return comparepass ? result : false;
};

export const checkTokenPlusUser = async (id, dbToken) => {
  const user = await getUserById(id);
  if (!user) return false;
  const comparetokens = compareTokens(user.token, dbToken);
  return comparetokens ? user : false;
};

const updateUserWithToken = async (newUser, id) => {
  newUser.token = createToken(id);
  return newUser;
};

export const deleteTokenFromUser = async (userData) => {
  userData.token = null;
  const user = await User.findByIdAndUpdate(userData.id, userData, {
    new: true,
  });
  return user ? true : false;
};

export const createUser = async (userData) => {
  userData.password = await hashPassword(userData.password);
  const newUser = new User(userData);
  //await updateUserWithToken(newUser, newUser._id); //in case of register&login by one attempt
  await newUser.save();
  newUser.password = "";
  return newUser;
};

export const login = async (user) => {
  const { _id } = user;
  const userToken = await updateUserWithToken(user, _id);
  const loggedUser = await User.findByIdAndUpdate(
    _id,
    { token: userToken.token },
    { new: true }
  );
  return loggedUser;
};