import { PrismaClient} from "@prisma/client";
import { ITransaction, ITransactionListPayload } from "../types/transaction";
import { UUID } from "crypto";


const prisma = new PrismaClient();
export class TransactService {
  async makeTransaction(payload: ITransaction) {
    try {
      await prisma.transaction.create({
        data: payload,
      });
      return {};
    } catch (error: any) {
      throw new Error("Error in transact: " + error?.message);
    }
  }

  async getTransactionService(id: UUID) {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id },
        include: { user: true }, // Optional: Include related user data if needed
      });
      return transaction;
    } catch (error: any) {
      throw new Error("Error in transact: " + error?.message);
    }
  }

  async getTransactionsService(payload: ITransactionListPayload) {
    try {
      const skip =
        (parseInt(payload.page + "") - 1) * parseInt(payload.pageSize + "");
      const take = parseInt(payload.pageSize + "");
      const query: any = {
        ...(payload.userId ? { userId: payload.userId } : {}),
        ...(payload.status ? { status: payload.status } : {}),
        createdAt: {
          ...(payload.startDate ? { gte: new Date(payload.startDate) } : {}),
          ...(payload.endDate ? { lte: new Date(payload.endDate) } : {}),
        },
      };

      // Fetch transactions and count
      const [rows, count] = await Promise.all([
        prisma.transaction.findMany({
          where: query,
          skip,
          take,
          include: { user: true }, // Include related user data if needed
          orderBy: { createdAt: "desc" }, // Sort by creation date
        }),
        prisma.transaction.count({ where: query }), // Get total count of transactions
      ]);

      // Send response
      return { rows, count };
    } catch (error: any) {
      throw new Error("Error in transact: " + error?.message);
    }
  }
}
