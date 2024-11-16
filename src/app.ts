import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/authRoutes";
import { transactRoutes } from "./routes/transactRoutes";
import { loanRoutes } from "./routes/loanRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactRoutes);
app.use("/api/loan", loanRoutes);

export default app;
