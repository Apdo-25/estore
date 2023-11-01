import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function getProduct(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle GET request to retrieve product data
  if (req.method === "GET") {
    try {
      // Retrieve product data from the database using Prisma
      const products = await prisma.product.findMany();

      // Return the list of products as JSON response
      res.status(200).json(products);
    } catch (error) {
      // Handle any errors, e.g., database errors
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await prisma.$disconnect(); // Close the database connection
    }
  } else {
    // Handle unsupported HTTP methods
    res.status(405).end();
  }
}
