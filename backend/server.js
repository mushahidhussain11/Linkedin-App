import express from "express";
import dotenv from "dotenv";

import { connectToDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";


dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on the port ${PORT}`);
  connectToDB();
});




