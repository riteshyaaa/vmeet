import express from "express";
import { createServer } from "node:http";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/users.routes.js";
import { initDB } from "./config/db.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

const start = async () => {
  try {
    await initDB();
  } catch (e) {
    console.error("PostgreSQL connection error:", e.message);
    console.log("Please check your DB credentials in backend/.env");
  }

  server.listen(app.get("port"), () => {
    console.log(`Server is running at port ${app.get("port")}`);
  });
};

start();
