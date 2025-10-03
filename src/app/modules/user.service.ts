import { Prisma, User } from "@prisma/client";
import { prisma } from "../config/db";
import AppError from "../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";

const createUser = async (payload: Prisma.UserCreateInput): Promise<User> => {
  const createdUser = await prisma.user.create({
    data: payload,
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
  return allUsers;
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

const updateUser = async (userId: string, payload: Partial<User>) => {
  const isUserExist = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      isVerified: true,
    },
  });

  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User not found");
  }
  if (!isUserExist.isVerified) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "User is not verified. Cannot update data."
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
