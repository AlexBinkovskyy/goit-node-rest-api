import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const hashPassword = (pass) => bcrypt.hash(pass, 10);

const comparePass = async (pass, hashPass) =>
  await bcrypt.compare(pass, hashPass);

const createToken = (id) => {
  const { SECRET_KEY } = process.env;
  return jwt.sign({ id }, SECRET_KEY, {expiresIn: '24h'});
};

export const checkUserByEmail = async (email) => {
  return await User.findOne({ email }, { password: 1, email: 1 });
};

export const checkUserCreds = async (creds) => {
  const result = await checkUserByEmail(creds.email);
  if (!result) return false;
  const comparepass = await comparePass(creds.password, result.password);
  return comparepass ? result : false;
};

const updateUserWithtoken = async (newUser, id) => {
  newUser.token = createToken(id);
  return newUser;
};

export const createUser = async (userData) => {
  userData.password = await hashPassword(userData.password);
  const newUser = new User(userData);
  await updateUserWithtoken(newUser, newUser._id);
  await newUser.save();
  newUser.password = "";
  return newUser;
};

export const login = async (user) => {
    const {_id } = user
    const userToken = await updateUserWithtoken(user, _id)
    const loggedUser = await User.findByIdAndUpdate(_id, {token: userToken.token }, {new: true})
    return loggedUser;
};
