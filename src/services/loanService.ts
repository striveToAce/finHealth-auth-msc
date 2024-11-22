import {
  PrismaClient,
  TransactionStatus,
  UserLoanStatus,
} from "@prisma/client";
import {
  IEMIListing,
  ILoan,
  ILoanListPayload,
  IPayEMI,
  IRecurringTransaction,
} from "../types/loan";
import moment from "moment";

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
        const existEmiInfo = await prisma.recurringTransaction.findMany({
          where: {
            loanId: payload.id,
            status: TransactionStatus.PENDING,
          },
        });
        if (existEmiInfo && existEmiInfo.length) {
          await prisma.recurringTransaction.updateMany({
            where: {
              loanId: payload.id,
              status: TransactionStatus.PENDING,
            },
            data: {
              title: `Pending EMI ${payload.emiMonth} - ${payload.title}`,
              amount: payload.emiAmount,
              isCredit: false,
            },
          });
        }
        return { message: "Loan info updated successfully" };
      } else {
        // Create case: create a new loan record with the provided data
        const createdLoan = await prisma.userLoan.create({
          data: payload,
        });
        await prisma.recurringTransaction.create({
          data: {
            title: `Pending EMI ${payload.emiMonth} - ${payload.title}`,
            amount: payload.emiAmount,
            isCredit: false,
            loanId: createdLoan.id,
            status: TransactionStatus.PENDING,
            userId: payload.userId,
          },
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

  async getAllEmis(payload: IEMIListing) {
    try {
      const skip =
        (parseInt(payload.page + "") - 1) * parseInt(payload.pageSize + "");
      // The take value is set to the page size
      const take = parseInt(payload.pageSize + "");
      const query = {
        status: TransactionStatus.PENDING,
        userId: payload.userId,
      };

      const [rows, count] = await Promise.all([
        // Fetch the loans with the given query parameters
        prisma.recurringTransaction.findMany({
          where: query,
          take,
          skip,
          include: { loanInfo: true },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.recurringTransaction.count({ where: query }),
      ]);

      return { count, rows };
    } catch (error: any) {
      // Catch any errors that occur and throw a new error with a descriptive message
      throw new Error("Error in fetching emi info: " + error?.message);
    }
  }
  async payEmiService(payload: IPayEMI) {
    try {
      const loanInfo = await prisma.userLoan.findUnique({
        where: { id: payload.loanId, status: "ACTIVE" },
      });
      if (!loanInfo) {
        throw new Error("active Loan not found");
      }
      const emiAmount = loanInfo.emiAmount;
      await prisma.recurringTransaction.update({
        where: { id: payload.emiId },
        data: {
          status: TransactionStatus.COMPLETED,
          updatedAt: moment().format("DD-MM-YYYY"),
          reason: payload.reason,
        },
      });
      await prisma.userLoan.update({
        where: { id: payload.loanId },
        data: {
          emiQty: loanInfo.emiQty - 1,
          status:
            loanInfo.emiQty - 1 === 0
              ? UserLoanStatus.CLOSED
              : UserLoanStatus.ACTIVE,
        },
      });

      await prisma.transaction.create({
        data: {
          title: `Paid EMI ${payload.month} - ${loanInfo.title}`,
          amount: emiAmount,
          isCredit: false,
          status: TransactionStatus.COMPLETED,
          description: "",
          label: "EMI",
          reason: payload.reason,
          userId: payload.userId,
        },
      });

      if (loanInfo.emiQty - 1) {
        const emiCreatePayload: IRecurringTransaction = {
          title: `Pending EMI ${payload.month} - ${loanInfo.title}`,
          amount: emiAmount,
          isCredit: false,
          loanId: payload.loanId,
          month: payload.month + 1 > 12 ? 1 : payload.month + 1,
          status: TransactionStatus.PENDING,
          userId: payload.userId,
        };
        await prisma.recurringTransaction.create({
          data: emiCreatePayload,
        });
      }

      return { message: "EMI paid successfully" };
    } catch (err) {
      throw err;
    }
  }
}
