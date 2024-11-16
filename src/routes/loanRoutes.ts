import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  validateLoanCreation,
  validateLoansListPayload,
} from "../validators/loan";
import {
  createUpdateLoan,
  getLoanInfo,
  getLoansList,
} from "../controllers/loanController";

const router = Router();

router.post(
  "/addUpdate",
  authMiddleware,
  validateLoanCreation,
  validateRequest,
  createUpdateLoan
);
router.post(
  "/getLoanInfo",
  authMiddleware,
  validateLoansListPayload,
  validateRequest,
  getLoanInfo
);
router.post("/getAllLoans", authMiddleware, getLoansList);

export { router as loanRoutes };