import { Request, Response } from "express";
import { ResponseHandler } from "../utils/responseHandler";
import { AuthenticatedRequest } from "../types/auth";
import { LoanService } from "../services/loanService";

const loanService = new LoanService();
export const createUpdateLoan = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const response = await loanService.createUpdateLoanService({
      ...req.body,
      userId: req.user.userId,
    });
    return ResponseHandler.success(res, response, "loan info add/update :)");
  } catch (error) {
    return ResponseHandler.error(res, error, "loan info add/update :)");
  }
};

export const getLoanInfo = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const loanInfo = await loanService.getLoanInfoService(id);
    return ResponseHandler.success(res, loanInfo, "loan info :)");
  } catch (error) {
    return ResponseHandler.error(res, error, "fetching loan info failed:(");
  }
};

export const getLoansList = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const transactionData = await loanService.getAllLoansService({
      ...req.body,
      userId: req.user.userId,
    });
    return ResponseHandler.success(res, transactionData, "loans :)");
  } catch (error) {
    return ResponseHandler.error(res, error, "fetching data failed:(");
  }
};

export const getAllEmis = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const transactionData = await loanService.getAllEmis({
      ...req.body,
      userId: req.user.userId,
    });
    return ResponseHandler.success(res, transactionData, "emis fetched :)");
  } catch (error) {
    return ResponseHandler.error(res, error, "fetching data failed:(");
  }
};

export const payEmi = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const transactionData = await loanService.payEmiService({
      ...req.body,
      userId: req.user.userId,
    });
    return ResponseHandler.success(res, transactionData, "emi paid :)");
  } catch (error) {
    return ResponseHandler.error(res, error, "error during emi payment:(");
  }
};
