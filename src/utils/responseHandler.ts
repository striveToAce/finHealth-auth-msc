import { Response } from "express";

export class ResponseHandler {
  static success(res: Response, data: any, message = "Success") {
    res.status(200).json({
      status: true,
      message,
      data,
    });
  }

  static error(
    res: Response,
    error: any,
    message = "An error occurred",
    statusCode = 500
  ) {
    console.error("Error:", error); // Log the error for debugging purposes

    res.status(statusCode).json({
      status: false,
      message,
      error: typeof error === "string" ? error : error.message,
    });
  }

  static validationError(
    res: Response,
    error: any,
    message = "Validation Error",
    statusCode = 400
  ) {
    res.status(statusCode).json({
      status: false,
      error,
      message,
    });
  }
}
