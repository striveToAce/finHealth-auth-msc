import app from './app';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 4401;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { prisma };