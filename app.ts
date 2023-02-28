import express, { json } from "express";
import morgan from "morgan";
import authRouter from "./routes/authRoutes";
import dotenv from "dotenv";
import errorController from "./controllers/errorController";
dotenv.config({ path: "./config.env" });

const app = express();

app.use(json());

//Global Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/auth", authRouter);

app.use(errorController);

export default app;
