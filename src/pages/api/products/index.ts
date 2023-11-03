import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function getProduct(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // Default values
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10; // default limit to 10 items

    // Skip calculates how many items to skip based on the current page
    const skip = (page - 1) * limit;

    try {
      const products = await prisma.product.findMany({
        skip: skip,
        take: limit,
      });

      const totalProducts = await prisma.product.count(); // To inform the client about the total number of products

      res.status(200).json({
        data: products,
        totalPages: Math.ceil(totalProducts / limit), // Total number of pages
        currentPage: page,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).end();
  }
}
