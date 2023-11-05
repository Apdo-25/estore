import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function viewCart(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID must be provided" });
  }

  try {
    const cart = await prisma.cart.findFirst({
      where: { userId: String(userId) },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch the cart" });
  }
}
