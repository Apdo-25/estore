import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const prisma = new PrismaClient();

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const lowerCaseEmail = email.toLowerCase();

  try {
    const user = await prisma.user.findUnique({
      where: { email: lowerCaseEmail },
    });

    if (!user) {
      return res.status(401).json({ error: "Email not found" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set the JWT in an HTTP-only cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("auth", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development", // use HTTPS in production
        maxAge: 3600, // 1 hour
        sameSite: "strict",
        path: "/",
      })
    );

    return res.status(200).json({ success: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);

    // More detailed error handling can be done based on the error type, but for now, let's return a generic message.
    return res
      .status(500)
      .json({ error: "Login failed, please try again later." });
  }
}
