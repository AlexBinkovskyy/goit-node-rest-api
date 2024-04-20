import multer from "multer";
import path from "node:path";
import HttpError from "../helpers/HttpError.js";
import Jimp from "jimp";
import crypto from "crypto";

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

export const processImage = async (req, res, next) => {
  const hashForName = crypto
    .Hash("md5")
    .update(Date.now().toString())
    .digest("hex");
  const fileExt = req.file.originalname.split(".").pop().toLowerCase();
  req.file.originalname = `${req.user.id}_${hashForName}.${fileExt}`;
};
