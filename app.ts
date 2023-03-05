import express, { json } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";

import errorController from "./controllers/errorController";
import authRouter from "./routes/authRoutes";
import mediaRouter from "./routes/mediaRoutes";
import profilesRouter from "./routes/profilesRoutes";
import authenticateUser from "./middleware/auth";

dotenv.config({ path: "./config.env" });

const app = express();

app.use(json());
app.use(cors());

//Global Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profiles", authenticateUser, profilesRouter);
app.use("/api/v1/media", authenticateUser, mediaRouter);

app.use(errorController);

export default app;
