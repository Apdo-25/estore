import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handleCartItem(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cartId: string = req.query.id as string;

  try {
    switch (req.method) {
      case "GET":
        const cartItem = await prisma.cart.findUnique({
          where: { id: cartId },
          include: { product: true, user: true }, // Include product and user details with cart item
        });
        if (!cartItem) {
          return res.status(404).json({ error: "Cart item not found" });
        }
        res.status(200).json(cartItem);
        break;

      case "PUT":
        const { quantity } = req.body;

        if (typeof quantity !== "number" || quantity < 1) {
          return res.status(400).json({ error: "Invalid quantity provided" });
        }

        const updatedCartItem = await prisma.cart.update({
          where: { id: cartId },
          data: { quantity },
        });
        res.status(200).json(updatedCartItem);
        break;

      case "DELETE":
        await prisma.cart.delete({ where: { id: cartId } });
        res.status(200).json({ message: "Item deleted successfully" });
        break;

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
