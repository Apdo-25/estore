import { getSession } from "next-auth/react";
import prisma from "@/utils/prisma";

export default async function handle(req, res) {
  const session = await getSession({ req });

  if (req.method === "POST") {
    try {
      const { cartItemId } = req.body;

      const userId = session?.user?.id;
      const sessionId = !userId ? req.cookies["next-auth.session-token"] : null;

      const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: { cart: true },
      });

      if (
        !cartItem ||
        (cartItem.cart.userId !== userId &&
          cartItem.cart.sessionId !== sessionId)
      ) {
        return res.status(403).json({
          message: "Not authorized to remove this item from the cart",
        });
      }

      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });

      res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove item from cart" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
