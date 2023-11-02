import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function createProduct(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle POST  request to create a product
  if (req.method === "POST") {
    try {
      // Process and validate the request body
      const {
        id,
        name,
        currency,
        price,
        description,
        flag,
        imageUrl,
        rating,
        ratingCount,
        features,
        salePrice,
        createdAt,
        updatedAt,
      } = req.body;

      // Update the product in the database using Prisma
      const createProduct = await prisma.product.create({
        data: {
          name,
          currency,
          price,
          description,
          flag,
          imageUrl,
          rating,
          ratingCount,
          features,
          salePrice,
          createdAt,
          updatedAt,
        },
      });

      // Return the newly created product as JSON response
      res.status(200).json(createProduct);
    } catch (error) {
      // Handle any errors, e.g., validation errors or database errors
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await prisma.$disconnect(); // Close the database connection
    }
  } else {
    // Handle unsupported HTTP methods
    res.status(405).end();
  }
}
