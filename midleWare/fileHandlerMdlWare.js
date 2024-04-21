import multer from "multer";
import path from "node:path";
import HttpError from "../helpers/HttpError.js";
import Jimp from "jimp";
import crypto from "crypto";
import fs from "fs/promises";
import { updateUserAvatar } from "../helpers/userServices.js";

const tempDirectory = path.resolve("temp");

const multerConfig = multer.diskStorage({
  destination: tempDirectory,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const filter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(HttpError(400, "Uploaded data must be an image"), false);
  }
};

export const upload = multer({
  storage: multerConfig,
  fileFilter: filter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

const pathTo = path.join("public", "avatars/");

export const checkOldAvatar = async (req, res, next) => {
  let oldAvatar = await fs.readdir(pathTo);
  oldAvatar = oldAvatar.find((avatar) => avatar.includes(req.user.id));
  oldAvatar ? (await fs.unlink(pathTo + oldAvatar), next()) : next();
};

export const processImage = async (req, res, next) => {
  const hashForName = crypto
    .Hash("md5")
    .update(Date.now().toString())
    .digest("hex");
  const fileExt = req.file.originalname.split(".").pop().toLowerCase();
  req.file.filename = `${req.user.id}_${hashForName}.${fileExt}`;
  next();
};

export const makeImagePublic = async (req, res, next) => {
  const pathFrom = path.join("temp", req.file.originalname);
  const pathTo = path.join("public", "avatars/");
  await Jimp.read(pathFrom).then((image) => {
    return image
      .resize(250, 250)
      .quality(100)
      .write(pathTo + req.file.filename);
  });
  const relativePathTo = path.join("avatars/");

  const avatarURL = {
    avatarURL: relativePathTo + req.file.filename,
  };

  await updateUserAvatar(req.user._id, avatarURL);
  await fs.unlink(pathFrom);
  res.status(200).json(avatarURL);
};
