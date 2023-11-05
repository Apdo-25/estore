import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function removeProductFromCart(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { cartItemId } = req.body;

  if (!cartItemId) {
    return res.status(400).json({ message: "Cart Item ID must be provided" });
  }

  await prisma.cartItem.delete({
    where: {
      id: cartItemId,
    },
  });

  res.status(200).json({ message: "Product removed from cart successfully" });
}
