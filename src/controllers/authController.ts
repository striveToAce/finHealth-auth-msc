import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { ResponseHandler } from "../utils/responseHandler";

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
    ResponseHandler.success(res, user, "signup success");
  } catch (error) {
    ResponseHandler.error(res, error, "signup failed");
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const token = await authService.loginService(username, password);
    ResponseHandler.success(res, token, "login success");
  } catch (error) {
    ResponseHandler.error(res, error, "login failed");
  }
};

// Example of refresh token endpoint
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    ResponseHandler.error(res, {}, "please provide rf token", 401);
  }

  try {
    const token = await authService.refreshTokenService(refreshToken);
    ResponseHandler.success(res, token, "access-token generated successfully");
  } catch (error) {
    ResponseHandler.error(res, error, "access-token generation failed!");
  }
};
