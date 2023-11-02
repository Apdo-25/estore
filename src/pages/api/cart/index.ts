import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getSessionId } from "@/utils/sessionUtil";

export default async function handleCart(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let sessionId = getSessionId(req);

  if (!req.cookies["session-id"]) {
    res.setHeader("Set-Cookie", `session-id=${sessionId}; Path=/; HttpOnly`);
  }

  try {
    switch (req.method) {
      case "GET":
        const carts = await prisma.cart.findMany({
          where: { sessionId },
          include: { product: true, user: true }, // Include product and user details with each cart item
        });
        res.status(200).json(carts);
        break;

      case "POST":
        const { productId, quantity } = req.body;

        if (!productId || typeof quantity !== "number" || quantity <= 0) {
          return res.status(400).json({
            error: "Invalid productId or quantity.",
          });
        }

        const productExists = await prisma.product.findUnique({
          where: { id: productId },
        });
        if (!productExists) {
          return res.status(404).json({ error: "Product not found" });
        }

        const cartItem = await prisma.cart.create({
          data: {
            productId,
            sessionId,
            quantity,
          },
        });
        res.status(201).json(cartItem);
        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error handling cart request:", error);
    res.status(500).json({
      error: `An error occurred: ${error.message}`,
    });
  }
}
