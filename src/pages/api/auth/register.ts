import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method not allowed");
  }

  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const lowerCaseEmail = email.toLowerCase();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: lowerCaseEmail },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Email already taken" });
    }

    const user = await prisma.user.create({
      data: {
        email: lowerCaseEmail,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    // Exclude password from the returned user object
    const { password: _, ...userWithoutPassword } = user;

    // Sign a JWT token
    const token = jwt.sign(userWithoutPassword, JWT_SECRET, {
      expiresIn: "1h", // expires in 1 hour
    });

    // Set the JWT token in an HTTP-only cookie
    res.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=3600`
    );

    return res.status(201).json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ error: "Registration failed" });
  }
}
