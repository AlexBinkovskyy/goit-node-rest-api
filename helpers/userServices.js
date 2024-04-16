import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import lockPass from "bcryptjs";

export const checkUserByEmail = async (email) => {
  const result = await User.findOne({ email });
  return result;
};

const updateUserWithtoken = async (newUser, id) => {
  const { SECRET_KEY } = process.env;
  const token = jwt.sign({ id }, SECRET_KEY);
  newUser.token = token;
  return newUser;
};

export const createUser = async (userData) => {
  userData.password = await lockPass.hash(userData.password, 10);
  const newUser = new User(userData);
  await updateUserWithtoken(newUser, newUser._id);
  await newUser.save();
  newUser.password = "";
  return newUser;
};
