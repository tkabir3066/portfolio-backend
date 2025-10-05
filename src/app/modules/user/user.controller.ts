import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.createUser(req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "User created successfully",
      data: user,
    });
  }
);
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.getAllUsers();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "All Users data retrieved successfully",
      data: result,
    });
  }
);
const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const result = await UserService.getUserById(userId);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Single User data retrieved successfully",
      data: result,
    });
  }
);
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    const payload = req.body;
    const verifiedToken = req.user;
    const result = await UserService.updateUser(
      userId,
      payload,
      verifiedToken as JwtPayload
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User Updated Successfully",
      data: result,
    });
  }
);
const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const result = await UserService.deleteUser(userId);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "User Deleted Successfully",
      data: result,
    });
  }
);

export const UserController = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
};
