import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import { StatusCodes } from "http-status-codes";
import { setAuthCookie } from "../../utils/setCookie";
import AppError from "../../errorHelpers/AppError";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthService.credentialsLogin(req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User Logged In successfully",
      data: loginInfo,
    });
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "No refresh token received from cookies"
      );
    }
    const tokenInfo = await AuthService.getNewAccessToken(
      refreshToken as string
    );

    // res.cookie("accessToken", tokenInfo.accessToken, {
    //   httpOnly: true,
    //   secure: false,
    // });

    setAuthCookie(res, tokenInfo);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "New access token retrieved successfully",
      data: tokenInfo,
    });
  }
);

const authWithGoogle = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthService.credentialsLogin(req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User Logged In successfully",
      data: loginInfo,
    });
  }
);

export const AuthController = {
  credentialsLogin,
  getNewAccessToken,
  authWithGoogle,
};
