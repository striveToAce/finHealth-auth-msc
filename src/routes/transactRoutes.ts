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
import { validateRequest } from "../middlewares/validateRequest";

const router = Router();

router.post(
  "/transact",
  authMiddleware,
  validateTransactionCreation,
  validateRequest,
  makeTransaction
);
router.post(
  "/getTransactions",
  authMiddleware,
  validateTransactionListPayload,
  validateRequest,
  getTransactionList
);
router.post("/getTransaction", authMiddleware, getOneTransaction);

export { router as transactRoutes };
