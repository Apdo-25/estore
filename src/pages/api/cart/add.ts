import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function addProductToCart(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res
      .status(400)
      .json({ message: "User ID and Product ID must be provided" });
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      cart: {
        userId: userId,
      },
      productId: productId,
    },
  });

  if (cartItem) {
    // Product already in cart, increase quantity
    await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        quantity: {
          increment: 1,
        },
      },
    });
  } else {
    // Product not in cart, add new CartItem
    await prisma.cartItem.create({
      data: {
        cart: {
          connect: {
            userId: userId,
          },
        },
        product: {
          connect: {
            id: productId,
          },
        },
        quantity: 1,
      },
    });
  }

  res.status(200).json({ message: "Product added to cart successfully" });
}
