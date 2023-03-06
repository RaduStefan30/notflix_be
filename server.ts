import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  secure: true,
});

dotenv.config({ path: "./config.env" });

//In order to catch any uncaught exception this needs to run before anything else
//Also to avoid unclean state
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception", err.name, err.message, "Shutting Down....");

  process.exit(1);
});

const DB = process.env.DATABASE!.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD!
);

mongoose.set("strictQuery", false);
mongoose.connect(DB).then(() => console.log("Database connection succesfull"));
const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server listening on ${port}...`);
});

//for unhandled promise rejection e.g. database connection fail
process.on("unhandledRejection", (err: any) => {
  console.log(
    "Unhandled Rejection",
    err.name,
    err.message,
    "Shutting Down...."
  );

  //give server time to finish all the requests before killing it
  server.close(() => {
    process.exit(1);
  });
});

export default cloudinary;
