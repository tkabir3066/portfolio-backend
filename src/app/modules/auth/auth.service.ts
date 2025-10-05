import { User } from "@prisma/client";
import { prisma } from "../../config/db";
import AppError from "../../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import bcryptjs from "bcryptjs";
import { Prisma } from "@prisma/client";
import {
  createNewAccessTokenWithAccessToken,
  createUserTokens,
} from "../../utils/userTokens";

const credentialsLogin = async (payload: Partial<User>) => {
  const { email, password } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!isUserExist) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "User does not exist with this email"
    );
  }

  //check if password correct or not
  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password
  );

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Password is incorrect");
  }

  const userTokens = createUserTokens(isUserExist);
  // Remove password field
  const { password: _, ...userData } = isUserExist;
  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: userData,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithAccessToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

const authWithGoogle = async (data: Prisma.UserCreateInput) => {
  let user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: data,
    });
  }

  return user;
};

export const AuthService = {
  credentialsLogin,
  getNewAccessToken,
  authWithGoogle,
};
