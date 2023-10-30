// pages/api/products/update.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function updateProduct(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle PUT request to update a product
  if (req.method === "PUT") {
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
      const updatedProduct = await prisma.product.update({
        where: { id },
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

      // Return the updated product as JSON response
      res.status(200).json(updatedProduct);
    } catch (error) {
      // Handle any errors, e.g., validation errors or database errors
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // Handle unsupported HTTP methods
    res.status(405).end();
  }
}
