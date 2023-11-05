// Inside your add.ts file
import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userId, productId, quantity } = req.body;

    try {
      // Check if the cart exists
      let cart = await prisma.cart.findFirst({
        where: { userId },
      });

      // If the cart doesn't exist, create a new one
      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            userId,
            items: {
              create: [{ productId, quantity }],
            },
          },
          include: {
            items: true,
          },
        });
      } else {
        // If the cart exists, add the new item or update the quantity
        const existingItem = await prisma.cartItem.findFirst({
          where: {
            cartId: cart.id,
            productId,
          },
        });

        if (existingItem) {
          // Update the existing cart item quantity
          await prisma.cartItem.update({
            where: {
              id: existingItem.id,
            },
            data: {
              quantity: existingItem.quantity + quantity,
            },
          });
        } else {
          // Create a new cart item
          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              productId,
              quantity,
            },
          });
        }
      }

      // Return the updated cart
      return res.status(200).json(cart);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
