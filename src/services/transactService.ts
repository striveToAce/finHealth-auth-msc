import { PrismaClient } from "@prisma/client";
import { ITransaction, ITransactionListPayload } from "../types/transaction";
import { UUID } from "crypto";

const prisma = new PrismaClient();
export class TransactService {
  /**
   * Create or update a transaction
   * @param payload - The transaction data to create or update
   * @returns A success message
   * @throws An error if the transaction cannot be created or updated
   */
  async makeTransaction(payload: ITransaction) {
    try {
      if (payload.id) {
        // Update case
        // Update an existing transaction
        await prisma.transaction.update({
          where: {
            id: payload.id,
          },
          data: payload,
        });
        return { message: "Transaction updated successfully" };
      } else {
        // Create case
        // Create a new transaction
        await prisma.transaction.create({
          data: payload,
        });
        return { message: "Transaction created successfully" };
      }
    } catch (error: any) {
      // Catch any errors that occur and throw a new error
      throw new Error("Error in transact: " + error?.message);
    }
  }

  /**
   * Get a single transaction by its ID
   * @param id - The ID of the transaction to fetch
   * @returns The transaction data if found, otherwise null
   * @throws An error if the transaction cannot be found
   */
  async getTransactionService(id: string) {
    try {
      // Fetch the transaction and include related user data if needed
      const transaction = await prisma.transaction.findUnique({
        where: { id },
        include: { user: true }, // Include related user data if needed
      });
      return transaction;
    } catch (error: any) {
      // Catch any errors that occur and throw a new error
      throw new Error("Error in transact: " + error?.message);
    }
  }

  /**
   * Fetch a list of transactions based on the given parameters
   * @param payload - The parameters to filter the transactions with
   * @returns A list of transactions and the total count of transactions
   * @throws An error if the transactions cannot be fetched
   */
  async getTransactionsService(payload: ITransactionListPayload) {
    try {
      // The skip value is calculated by subtracting 1 from the page number and multiplying it with the page size
      const skip =
        (parseInt(payload.page + "") - 1) * parseInt(payload.pageSize + "");
      // The take value is set to the page size
      const take = parseInt(payload.pageSize + "");
      // The query object is created with the given parameters
      const query: any = {
        ...(payload.userId ? { userId: payload.userId } : {}),
        ...(payload.status ? { status: payload.status } : {}),
        // The createdAt field is a date range, so we need to convert the date strings to Date objects
        createdAt: {
          ...(payload.startDate ? { gte: new Date(payload.startDate) } : {}),
          ...(payload.endDate ? { lte: new Date(payload.endDate) } : {}),
        },
        ...(payload.search
          ? {
              title: {
                contains: payload.search,
                mode: "insensitive", // Case-insensitive search
              },
            }
          : {}),
        ...(payload.transactionType === "DEBIT"
          ? {
              isCredit: false,
            }
          : payload.transactionType === "CREDIT"
          ? { isCredit: true }
          : {}),
      };

      let orderBy: { amount?: "desc" | "asc"; createdAt?: "desc" | "asc" } = {};
      if (payload.sortBy) {
        switch (payload.sortBy) {
          case "amount-asc":
            orderBy = { amount: "asc" };
            break;
          case "amount-desc":
            orderBy = { amount: "desc" };
            break;
          case "date-asc":
            orderBy = { createdAt: "asc" };
            break;
          case "date-desc":
            orderBy = { createdAt: "desc" };
            break;
          default:
            orderBy = { createdAt: "desc" }; // No sorting applied
        }
      }

      // Fetch transactions and count using Promise.all
      // This is done to avoid a race condition where the count is fetched before the transactions
      const [rows, count] = await Promise.all([
        // Fetch transactions with the given query parameters
        // Include related user data if needed
        // Sort by creation date in descending order
        prisma.transaction.findMany({
          where: query,
          skip,
          take,
          include: { user: true },
          orderBy,
        }),
        // Get total count of transactions with the given query parameters
        prisma.transaction.count({ where: query }),
      ]);

      // Send response
      return { rows, count };
    } catch (error: any) {
      // Catch any errors that occur and throw a new error
      throw new Error("Error in transact: " + error?.message);
    }
  }
}
