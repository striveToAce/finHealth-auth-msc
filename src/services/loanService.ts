import { PrismaClient } from "@prisma/client";
import { ITransaction, ITransactionListPayload } from "../types/transaction";
import { ILoan, ILoanListPayload } from "../types/loan";

const prisma = new PrismaClient();
export class LoanService {
  /**
   * Create or update a loan record
   * @param payload - The loan data to create or update
   * @returns A success message indicating the operation result
   * @throws An error if the loan cannot be created or updated
   */
  async createUpdateLoanService(payload: ILoan) {
    try {
      if (payload.id) {
        // Update case: update an existing loan record using the provided ID
        await prisma.userLoan.update({
          where: {
            id: payload.id,
          },
          data: payload,
        });
        return { message: "Loan info updated successfully" };
      } else {
        // Create case: create a new loan record with the provided data
        await prisma.userLoan.create({
          data: payload,
        });
        return { message: "Loan info created successfully" };
      }
    } catch (error: any) {
      // Catch any errors that occur and throw a new error with a descriptive message
      throw new Error("Error in loan add/update: " + error?.message);
    }
  }

  /**
   * Fetch a single loan record by its ID
   * @param id - The ID of the loan record to fetch
   * @returns The loan record data if found, otherwise null
   * @throws An error if the loan record cannot be found
   */
  async getLoanInfoService(id: string): Promise<ILoan | null> {
    try {
      // Fetch the loan record and include related user data if needed
      const loan = await prisma.userLoan.findUnique({
        where: { id },
        include: { user: true }, // Include related user data if needed
      });
      return loan;
    } catch (error: any) {
      // Catch any errors that occur and throw a new error
      throw new Error(`Error in fetching loan info: ${error?.message}`);
    }
  }

  /**
   * Fetch a list of loans based on the given parameters
   * @param payload - The parameters to filter the loans with
   * @returns A list of loans and the total count of loans
   * @throws An error if the loans cannot be fetched
   */
  async getAllLoansService(payload: ILoanListPayload) {
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
        },
        ...(payload.search
          ? {
              title: {
                // Case-insensitive search
                contains: payload.search,
                mode: "insensitive",
              },
            }
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

      const [rows, count] = await Promise.all([
        // Fetch the loans with the given query parameters
        prisma.userLoan.findMany({
          where: query,
          skip,
          take,
          include: { user: true }, // Include related user data if needed
          orderBy,
        }),
        // Get total count of loans with the given query parameters
        prisma.userLoan.count({ where: query }),
      ]);

      return { rows, count };
    } catch (error: any) {
      // Catch any errors that occur and throw a new error with a descriptive message
      throw new Error("Error in fetching loan info: " + error?.message);
    }
  }
}
