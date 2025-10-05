import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { generateToken, verifyToken } from "./jwt";
import AppError from "../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { User, UserStatus } from "@prisma/client";
import { prisma } from "../config/db";

export const createUserTokens = (user: Partial<User>) => {
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithAccessToken = async (
  refreshToken: string
) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;
  //   const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  const isUserExist = await prisma.user.findUnique({
    where: {
      email: verifiedRefreshToken.email,
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

  const jwtPayload = {
    userId: isUserExist.id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return accessToken;
};
