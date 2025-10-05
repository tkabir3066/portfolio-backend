import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { prisma } from "../config/db";
import { UserStatus } from "@prisma/client";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(StatusCodes.FORBIDDEN, "No token received", "");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      //   const isUserExist = await User.findOne({
      //     email: verifiedToken.email,
      //   });

      const isUserExist = await prisma.user.findUnique({
        where: {
          email: verifiedToken.email,
        },
      });

      if (!isUserExist) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          "User does not exist with this email"
        );
      }
      if (
        isUserExist.status === UserStatus.BLOCK ||
        isUserExist.status === UserStatus.INACTIVE
      ) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `User is ${isUserExist.status}`
        );
      }

      // authRoles = ["ADMIN", "SUPER_ADMIN"]
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          "You are not authorized to view this route"
        );
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
