import { Prisma, Role, User } from "@prisma/client";
import { prisma } from "../../config/db";
import bcryptjs from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

const createUser = async (payload: Prisma.UserCreateInput): Promise<User> => {
  const { email, password, ...rest } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (isUserExist) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "User with this email already exist"
    );
  }

  //hashed password
  const hashedPassword = await bcryptjs.hash(
    password,
    Number(process.env.BCRYPT_SALT_ROUND)
  );
  const createdUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      ...rest,
    },
  });
  return createdUser;
};

const getAllUsers = async () => {
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      picture: true,
      role: true,
      bio: true,
      status: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.user.count();
  return {
    data: allUsers,
    totalUsers: total,
  };
};

const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      picture: true,
      role: true,
      bio: true,
      status: true,
      isVerified: true,
      createdAt: true,
    },
  });

  return user;
};

const deleteUser = async (userId: string) => {
  const deletedUser = await prisma.user.delete({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return deletedUser;
};

const updateUser = async (
  userId: string,
  payload: Partial<User>,
  decodedToken: JwtPayload
) => {
  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.USER) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
    }

    // promoting to  admin -->  admin
    if (payload.role === Role.ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
    }
  }

  //rehashing the password

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      picture: true,
      status: true,
      role: true,
      bio: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};
export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
};
