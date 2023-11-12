import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function getProduct(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 10, 100); // Limit the maximum number of items per page

  if (page < 1 || limit < 1) {
    return res.status(400).json({ error: "Invalid query parameters" });
  }

  try {
    const skip = (page - 1) * limit;
    const [products, totalProducts] = await Promise.all([
      prisma.product.findMany({ skip, take: limit }),
      prisma.product.count(),
    ]);

    return res.status(200).json({
      data: products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
