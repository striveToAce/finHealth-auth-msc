import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  getOneTransaction,
  getTransactionList,
  makeTransaction,
} from "../controllers/transactController";
import {
  validateTransactionCreation,
  validateTransactionListPayload,
} from "../validators/transaction";

const router = Router();

router.post(
  "/transact",
  validateTransactionListPayload,
  authMiddleware,
  makeTransaction
);
router.post("/getTransactions", authMiddleware, getTransactionList);
router.post(
  "/getTransaction",
  authMiddleware,
  validateTransactionCreation,
  getOneTransaction
);

export { router as transactRoutes };
