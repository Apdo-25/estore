// pages/api/products/create.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function createProduct(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle POST request to create a product
  if (req.method === "POST") {
    try {
      // Process and validate the request body
      const {
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
      } = req.body;

      // Create a new product in the database using Prisma
      const newProduct = await prisma.product.create({
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
        },
      });

      // Return the newly created product as JSON response
      res.status(200).json(newProduct);
    } catch (error) {
      // Handle any errors, e.g., validation errors or database errors
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // Handle unsupported HTTP methods
    res.status(405).end();
  }
}
