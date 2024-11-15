export interface ICreateTransaction {
    
}

export enum TransactionStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
  }
  
  export interface ITransaction {
    id?: string; // UUID
    title: string; // Max 100 characters
    description: string; // Max 200 characters
    amount: number; // Decimal with minimum value of 0
    isCredit: boolean; // Credit or debit
    createdAt?: Date; // Date of creation
    updatedAt?: Date; // Date of last update
    label: string; // Max 50 characters
    status: TransactionStatus; // Enum: PENDING, COMPLETED, FAILED
    reason?: string; // Optional, max 200 characters
    userId: string; // UUID of the user
  }

  export interface ITransactionListPayload {
    page:number;
    pageSize:number;
    userId:string;
    startDate?:Date;
    endDate?:Date;
    status?:TransactionStatus
  }
  
