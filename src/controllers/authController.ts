import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { ResponseHandler } from "../utils/responseHandler";
import { AuthenticatedRequest } from "../types/auth";

const authService = new AuthService();
export const signup = async (req: Request, res: Response) => {
  const { firstName, password, username, lastName, dob } = req.body;
  try {
    const user = await authService.signupService(
      username,
      password,
      firstName,
      lastName,
      dob
    );
    return ResponseHandler.success(res, user, "signup success");
  } catch (error) {
    return ResponseHandler.error(res, error, "signup failed");
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const token = await authService.loginService(username, password);
    return ResponseHandler.success(res, token, "login success");
  } catch (error) {
    return ResponseHandler.error(res, error, "login failed");
  }
};

export const profileInfo = async (req: AuthenticatedRequest, res: Response) => {
  const { username } = req.body;
  try {
    const isSelf = req.user.username === username;
    const token = await authService.profileInfoService(username, isSelf);
    return ResponseHandler.success(res, token, "login success");
  } catch (error) {
    return ResponseHandler.error(res, error, "login failed");
  }
};

// Example of refresh token endpoint
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return ResponseHandler.error(res, {}, "please provide rf token", 401);
  }

  try {
    const token = await authService.refreshTokenService(refreshToken);
    return ResponseHandler.success(res, token, "access-token generated successfully");
  } catch (error) {
    return ResponseHandler.error(res, error, "access-token generation failed!");
  }
};
