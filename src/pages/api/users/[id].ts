import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";
import bcrypt from "bcrypt";

export default async function handleUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = req.query.id as string;

  if (req.method === "PUT") {
    try {
      const saltRounds = 10; // You can adjust this number based on your security requirements

      // If a new password is provided, hash it
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, saltRounds);
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: req.body,
      });

      // For security, do not return the password in the response
      delete updatedUser.password;

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.user.delete({
        where: { id: userId },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).end();
  }
}
