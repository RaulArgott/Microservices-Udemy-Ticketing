import mongoose from "mongoose";
import { app } from "./app";
/**
 * Start the server by connecting to the MongoDb and
 * listening on port 3000.
 *
 * Before starting, the JWT_KEY environment variable
 * must be set.
 */
const start = async () => {

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000!!");
  });
};

start();