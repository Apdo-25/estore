// pages/api/products/delete.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function deleteProduct(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle DELETE request to delete a product by ID
  if (req.method === "DELETE") {
    try {
      // Retrieve product ID from the request parameters
      const { id } = req.query;

      // Delete the product from the database using Prisma
      await prisma.product.delete({ where: { id: id.toString() } });

      // Return a success message
      res.status(204).end();
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
