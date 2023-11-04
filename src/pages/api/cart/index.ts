import { getSession } from "next-auth/react";
import prisma from "@/utils/prisma";

export default async function handle(req, res) {
  const session = await getSession({ req });

  if (req.method === "POST") {
    try {
      const { productId, quantity } = req.body;
      const userId = session?.user?.id;
      const sessionId = !userId ? req.cookies["next-auth.session-token"] : null;

      let cart = await prisma.cart.findFirst({
        where: {
          OR: [{ userId: userId }, { sessionId: sessionId }],
        },
        include: {
          items: true, // Only include the items array in the response
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            user: userId ? { connect: { id: userId } } : undefined,
            sessionId,
            items: {
              create: [{ product: { connect: { id: productId } }, quantity }],
            },
          },
          include: {
            items: true, // Only include the items array for the new cart
          },
        });
      } else {
        const cartItem = await prisma.cartItem.create({
          data: {
            cart: { connect: { id: cart.id } },
            product: { connect: { id: productId } },
            quantity,
          },
          include: {
            cart: {
              include: {
                items: true, // Include the items in the new cartItem creation
              },
            },
          },
        });
        cart.items.push(cartItem); // Add the new item to the cart items
      }

      // Only return the items array in the response
      res.status(200).json({ items: cart.items });
    } catch (error) {
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
