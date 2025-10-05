import z from "zod";
import { Role, UserStatus } from "@prisma/client";

/* export const createUserZodSchema = z.object({
  name: z
    .string({ error: "Name must be a string" })
    .min(3, {
      message: "Name is too short. It should be at least 3 characters long.",
    })
    .max(50, {
      message: "Name is too long. It should be no more than 50 characters.",
    }),

  email: z
    .email({ error: "Invalid email address format." })
    .min(5, { message: "Email must be at least 5 characters long." })
    .max(100, { message: "Email cannot exceed 100 characters." }),
  //1 uppercase, 1 lowercase, 1 special character, 1 digit and minimum total 8 characters
  password: z
    .string({ error: "Password must be string" })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    }),
  contact: z
    .string({ error: "Phone Number must be a string" })
    .regex(/^(\+91|91|0)?[6-9]\d{9}$/, {
      message:
        "Phone number must be valid for India. Format: +91XXXXXXXXXX, 91XXXXXXXXXX, 0XXXXXXXXXX or XXXXXXXXXX",
    })
    .optional(),

  bio: z
    .string({ error: "Bio must be string" })
    .max(200, { message: "Bio cannot exceed 300 characters." })
    .optional(),
  picture: z.string().url({ message: "Invalid URL" }).optional(),
  // Relations – validation typically references IDs, not full objects
  blogs: z.array(z.string().uuid()).optional(),
  projects: z.array(z.string().uuid()).optional(),
  skills: z.array(z.string().uuid()).optional(),
  experiences: z.array(z.string().uuid()).optional(),
}); */

// ✅ Regex helpers
const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // simple but effective email check

const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;

// User creation schema
export const createUserZodSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name is too short. It should be at least 3 characters long.",
    })
    .max(50, {
      message: "Name is too long. It should be no more than 50 characters.",
    }),

  email: z
    .string()
    .regex(emailRegex, { message: "Invalid email address format." })
    .min(5, { message: "Email must be at least 5 characters long." })
    .max(100, { message: "Email cannot exceed 100 characters." }),

  // ✅ Strong password: 1 uppercase, 1 lowercase, 1 digit, 1 special char, min 8 chars
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[a-z])/, {
      message: "Password must contain at least 1 lowercase letter.",
    })
    .regex(/^(?=.*\d)/, { message: "Password must contain at least 1 number." })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    }),

  contact: z
    .string()
    .regex(/^(\+91|91|0)?[6-9]\d{9}$/, {
      message:
        "Phone number must be valid for India. Format: +91XXXXXXXXXX, 91XXXXXXXXXX, 0XXXXXXXXXX or XXXXXXXXXX",
    })
    .optional(),

  bio: z
    .string()
    .max(200, { message: "Bio cannot exceed 200 characters." })
    .optional(),

  picture: z.string().regex(urlRegex, { message: "Invalid URL" }).optional(),

  // Relations – validation via UUID
  blogs: z
    .array(z.string().regex(uuidRegex, { message: "Invalid UUID" }))
    .optional(),
  projects: z
    .array(z.string().regex(uuidRegex, { message: "Invalid UUID" }))
    .optional(),
  skills: z
    .array(z.string().regex(uuidRegex, { message: "Invalid UUID" }))
    .optional(),
  experiences: z
    .array(z.string().regex(uuidRegex, { message: "Invalid UUID" }))
    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string({ error: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .optional(),
  password: z
    .string({ error: "Password must be string" })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    })
    .optional(),
  contact: z
    .string({ error: "Phone Number must be a string" })
    .regex(/^(\+91|91|0)?[6-9]\d{9}$/, {
      message:
        "Phone number must be valid for India. Format: +91XXXXXXXXXX, 91XXXXXXXXXX, 0XXXXXXXXXX or XXXXXXXXXX",
    })
    .optional(),
  role: z
    // .enum(["ADMIN", "GUIDE", "USER", "SUPER_ADMIN"])
    .enum(Object.values(Role) as [string])
    .optional(),
  status: z.enum(Object.values(UserStatus.ACTIVE) as [string]).optional(),
  isVerified: z
    .boolean({ error: "isVerified must be true or false" })
    .optional(),
});
