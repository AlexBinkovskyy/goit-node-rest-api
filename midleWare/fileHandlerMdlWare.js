import multer from "multer";
import path from "node:path";
import HttpError from "../helpers/HttpError.js";

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
    fileSize: 2*1024*1024
  }
});
