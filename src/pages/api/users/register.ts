import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";
import * as yup from "yup";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

// Validation schema
const userSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  role: yup.string().oneOf(["admin", "user"]),
});

export default async function createUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const validatedUser = await userSchema.validate(req.body);

      // Hash the password before storing it
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        validatedUser.password,
        saltRounds
      );

      // Replace the plaintext password with the hashed version
      validatedUser.password = hashedPassword;

      const newUser = await prisma.user.create({
        data: validatedUser as Prisma.UserCreateInput,
      });

      // For security, do not return the password in the response
      delete newUser.password;

      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).end();
  }
}
