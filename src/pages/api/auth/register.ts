// pages/api/users/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function getUserById(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: String(id) },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Be cautious about returning sensitive user info.
      // You might want to omit some fields here.
      const { password, ...userData } = user;

      return res.status(200).json(userData);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).end();
  }
}
