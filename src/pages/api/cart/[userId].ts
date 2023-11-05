import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { userId } = req.query;

    // Convert userId to String if it's not already to ensure proper querying.
    const stringUserId = typeof userId === "string" ? userId : String(userId);

    try {
      const cart = await prisma.cart.findFirst({
        where: { userId: stringUserId },
        include: {
          items: {
            include: {
              product: true, // Include related product data if needed
            },
          },
        },
      });

      // If no cart is found, cart will be null.
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // If a cart is found, return it in the response.
      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  } else {
    // If the request method is not GET, return method not allowed error.
    return res.status(405).json({ message: "Method not allowed" });
  }
}
