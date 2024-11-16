export interface ICreateLoan {
  id?: string; // UUID
  title: string; // Max 100 characters
  description: string; // Max 200 characters
  amount: number; // Decimal with minimum value of 0
  createdAt?: Date; // Date of creation
  updatedAt?: Date; // Date of last update
  label: string; // Max 50 characters
  status: UserLoanStatus; // Enum: PENDING, COMPLETED, FAILED
  emiQty: number;           
  lender: string; // lender info
  reason?: string; // Optional, max 200 characters
  userId?: string; // UUID of the user
}

export enum UserLoanStatus {
  CLOSED = "CLOSED",
  ACTIVE = "ACTIVE"
}

export interface ILoan {
  id?: string; // UUID
  title: string; // Max 100 characters
  description: string; // Max 200 characters
  amount: number; // Decimal with minimum value of 0
  createdAt?: Date; // Date of creation
  updatedAt?: Date; // Date of last update
  label: string; // Max 50 characters
  status: UserLoanStatus; // Enum: PENDING, COMPLETED, FAILED
  emiQty: number;           
  lender: string; // lender info
  reason?: string; // Optional, max 200 characters
  userId: string; // UUID of the user
}

export interface ILoanListPayload {
  page: number;
  pageSize: number;
  startDate?: Date;
  status?: UserLoanStatus;
  sortBy?: "date-asc" | "date-desc" | "amount-desc" | "amount-asc" | "";
  search?: string;
  userId?: string;
}
