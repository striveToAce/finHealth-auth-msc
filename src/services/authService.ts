import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../utils/hashPassword";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";
import { PrismaClient, User } from "@prisma/client";
import { getExpirationDate } from "../utils/functions";

interface UserWithOptionalPassword extends Omit<User, "password"> {
  password?: string;
}

interface IUserOtherProfile {
  username: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

const prisma = new PrismaClient();
export class AuthService {
  async signupService(
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    dob: Date
  ) {
    try {
      const hashedPassword = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          firstName,
          lastName,
          dob,
        },
      });
      const modifiedUser = { ...user } as UserWithOptionalPassword;
      delete modifiedUser.password;

      return { modifiedUser };
    } catch (error: any) {
      throw new Error("Error in signup: " + error?.message);
    }
  }

  async loginService(username: string, password: string) {
    try {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user || !(await comparePassword(password, user.password))) {
        throw new Error("Invalid credentials");
      }

      // destroying prev tokens
      await prisma.refreshToken.deleteMany({
        where: { userId: user.id },
      });

      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
      const expiresAt = getExpirationDate("7d");

      // Optionally, save the refresh token in the database to invalidate it later if needed
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt,
        },
      });

      return { accessToken, refreshToken };
    } catch (err: any) {
      throw new Error("Error in login: " + err?.message);
    }
  }

  async profileInfoService(username: string, isSelf: boolean) {
    try {
      const user = await prisma.user.findUnique({
        where: { username, isDeleted: false, isSuspended: false },
      });
      if (!user) {
        throw new Error("User not found!");
      }
      const modifiedUser = { ...user } as UserWithOptionalPassword;
      delete modifiedUser.password;

      const otherProfile: IUserOtherProfile = {
        firstName: modifiedUser.firstName,
        lastName: modifiedUser.lastName,
        username: modifiedUser.username,
        createdAt: modifiedUser.createdAt,
      };
      return isSelf ? modifiedUser : otherProfile;
    } catch (err: any) {
      throw new Error("Error in login: " + err?.message);
    }
  }
  async refreshTokenService(refreshToken: string) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as { userId: string };
      const newAccessToken = generateAccessToken(payload.userId);
      return { accessToken: newAccessToken, refreshToken };
    } catch (error: any) {
      throw new Error("Error in refresh token creation: " + error?.message);
    }
  }
}
