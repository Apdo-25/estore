import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function getAddressById(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const address = await prisma.address.findUnique({
        where: { id: String(id) },
      });

      if (!address) {
        return res.status(404).json({ error: "Address not found" });
      }

      return res.status(200).json(address);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).end();
  }
}
