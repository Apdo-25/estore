import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

// Helper function to calculate total price
async function calculateTotalPrice(cartId) {
  const cartItems = await prisma.cartItem.findMany({
    where: { cartId },
    include: { product: true },
  });
  return cartItems.reduce((total, item) => {
    return (
      total + (item.product.salePrice || item.product.price) * item.quantity
    );
  }, 0);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userId, productId, quantity } = req.body;

    try {
      let cart = await prisma.cart.findFirst({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            userId,
            items: {
              create: [{ productId, quantity }],
            },
          },
          include: {
            items: {
              include: {
                product: true, // This line ensures that the product info is included
              },
            },
          },
        });
      } else {
        const existingItem = await prisma.cartItem.findFirst({
          where: {
            cartId: cart.id,
            productId,
          },
        });

        if (existingItem) {
          await prisma.cartItem.update({
            where: {
              id: existingItem.id,
            },
            data: {
              quantity: existingItem.quantity + quantity,
            },
          });
        } else {
          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              productId,
              quantity,
            },
          });
        }
      }

      // Calculate the new total price
      const totalPrice = await calculateTotalPrice(cart.id);

      // Update the cart with the new total price
      const updatedCart = await prisma.cart.update({
        where: { id: cart.id },
        data: { totalPrice },
      });

      return res.status(200).json(updatedCart);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
