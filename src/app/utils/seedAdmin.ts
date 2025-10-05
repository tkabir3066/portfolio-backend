import { Prisma, Role, User } from "@prisma/client";
import { prisma } from "../config/db";
import { envVars } from "../config/env";
import bcrypt from "bcryptjs";

export const seedAdmin = async () => {
  try {
    // const isSuperAdminExist = await User.findOne({
    //   email: envVars.SUPER_ADMIN_EMAIL,
    // });

    const isSuperAdminExist = await prisma.user.findUnique({
      where: {
        email: envVars.ADMIN_EMAIL,
      },
    });

    if (isSuperAdminExist) {
      console.log("Super Admin already exist");
      return;
    }

    console.log("Trying to create super admin....");
    const hashedPassword = await bcrypt.hash(
      envVars.ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const payload: Prisma.UserCreateInput = {
      name: "Super Admin",
      email: envVars.ADMIN_EMAIL,
      role: Role.ADMIN,
      password: hashedPassword,
      isVerified: true,
      status: "ACTIVE",
    };

    const admin = await prisma.user.create({
      data: payload,
    });

    console.log("Admin created successfully \n");
    console.log(admin);
  } catch (error) {
    console.log(error);
  }
};
