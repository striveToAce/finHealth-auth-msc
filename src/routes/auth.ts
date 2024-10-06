import express from "express";
import { check } from "express-validator";
import {
  loginController,
  refreshTokenController,
  signupController,
} from "../controllers/authController";
import { validateRequest } from "../middlewares/validateRequest";

const router = express.Router();

// // Signup route
// router.post("/signup", signupController);

router.post("/login", loginController);

// Refresh token route
router.post("/refresh-token", refreshTokenController);

export default router;
