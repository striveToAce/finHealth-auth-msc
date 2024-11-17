import { body, check } from "express-validator";

export const validateLoanCreation = [
  check("id")
    .optional() // ID is optional in creation but should be valid if provided
    .isUUID()
    .withMessage("ID must be a valid UUID"),
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),

  check("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ max: 200 })
    .withMessage("Description cannot exceed 200 characters"),

  check("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number"),

  check("label")
    .notEmpty()
    .withMessage("Label is required")
    .isString()
    .withMessage("Label must be a string")
    .isLength({ max: 50 })
    .withMessage("Label cannot exceed 50 characters"),

  check("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["CLOSED", "ACTIVE"])
    .withMessage("Status must be one of PENDING, COMPLETED, or FAILED"),
  check("lender")
    .optional()
    .isString()
    .withMessage("Lender must be a string")
    .isLength({ max: 100 })
    .withMessage("Lender cannot exceed 100 characters"),

  check("reason")
    .optional()
    .isString()
    .withMessage("Reason must be a string")
    .isLength({ max: 200 })
    .withMessage("Reason cannot exceed 200 characters"),
];


export const validatePayEMIPayload = [
  body('loanId')
    .isString().withMessage('loanId must be a string')
    .notEmpty().withMessage('loanId is required'),
  
  body('amount')
    .isNumeric().withMessage('amount must be a number')
    .custom(value => value > 0).withMessage('amount must be greater than 0'),
  
  body('month')
    .isInt({ min: 1, max: 12 }).withMessage('month must be an integer between 1 and 12'),
  
  body('reason')
    .optional()
    .isString().withMessage('reason must be a string'),
];


export const validateLoansListPayload = [
  // Validate page
  check("page")
    .notEmpty()
    .withMessage("Page is required")
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  // Validate pageSize
  check("pageSize")
    .notEmpty()
    .withMessage("Page size is required")
    .isInt({ min: 1 })
    .withMessage("Page size must be a positive integer"),
  // Validate userId
  //   check("userId")
  //     .optional()
  //     .withMessage("UserId is required")
  //     .isUUID()
  //     .withMessage("UserId must be a valid UUID"),

  // Validate startDate
  //   check("startDate")
  //     .optional()
  //     .isISO8601()
  //     .withMessage("Start date must be a valid ISO8601 date"),

  // Validate endDate
  //   check("endDate")
  //     .optional()
  //     .isISO8601()
  //     .withMessage("End date must be a valid ISO8601 date"),

  // Validate status
  //   check("status")
  //     .optional()
  //     .isIn(["PENDING", "COMPLETED", "FAILED"])
  //     .withMessage("Status must be one of PENDING, COMPLETED, or FAILED"),
];
