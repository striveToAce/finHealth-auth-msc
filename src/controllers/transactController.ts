import { Request, Response } from "express";
import { ResponseHandler } from "../utils/responseHandler";
import { AuthenticatedRequest } from "../types/auth";
import { TransactService } from "../services/transactService";

const transactService = new TransactService();
export const makeTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = await transactService.makeTransaction(req.body);
    return ResponseHandler.success(res, transaction, "transaction done:)");
  } catch (error) {
    return ResponseHandler.error(res, error, "transaction failed");
  }
};

export const getOneTransaction = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const transaction = await transactService.getTransactionService(id);
    return ResponseHandler.success(res, transaction, "transaction info :)");
  } catch (error) {
    return ResponseHandler.error(res, error, "fetching transaction failed:(");
  }
};

export const getTransactionList = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const transactionData = await transactService.getTransactionsService(
      req.body
    );
    return ResponseHandler.success(res, transactionData, "transactions :)");
  } catch (error) {
    return ResponseHandler.error(res, error, "fetching data failed:(");
  }
};
