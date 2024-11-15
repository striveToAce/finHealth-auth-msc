import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/authRoutes";
import { transactRoutes } from "./routes/transactRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactRoutes);

export default app;
