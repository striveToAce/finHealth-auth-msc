import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  validateLoanCreation,
  validateLoansListPayload,
  validatePayEMIPayload,
} from "../validators/loan";
import {
  createUpdateLoan,
  getAllEmis,
  getLoanInfo,
  getLoansList,
  payEmi,
} from "../controllers/loanController";

const router = Router();

router.post(
  "/addUpdate",
  authMiddleware,
  validateLoanCreation,
  validateRequest,
  createUpdateLoan
);
router.post("/getLoanInfo", authMiddleware, getLoanInfo);
router.post(
  "/getAllLoans",
  authMiddleware,
  validateLoansListPayload,
  validateRequest,
  getLoansList
);

router.post(
  "getEMIList",
  authMiddleware,
  getAllEmis
);

router.post(
  "payEmi",
  authMiddleware,
  validatePayEMIPayload,
  validateRequest,
  payEmi
);

export { router as loanRoutes };
