import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/auth.js";
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger.json' assert { type: 'json' };

dotenv.config();
export const { SECRET_KEY, DB_HOST, PORT = 4000 } = process.env;
const app = express();

mongoose.set("strictQuery", true);
mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running. Use our API on port: 3000");
    });
    console.log("Database connection successfull");
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });

const logOutput = process.env.NODE_ENV === "dev" ? "tiny" : "short";

app.use(morgan(logOutput));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/users", authRouter);
app.use("/api/contacts", contactsRouter);
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
