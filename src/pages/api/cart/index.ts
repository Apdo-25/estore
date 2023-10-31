import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export default async function handleCart(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure the sessionId is set and is retrieved properly.
  let sessionId: string | null = req.cookies.sessionId || uuidv4();

  // Set a new sessionId in case it doesn't exist.
  if (!req.cookies.sessionId) {
    res.setHeader("Set-Cookie", `sessionId=${sessionId}; Path=/; HttpOnly`);
  }

  try {
    switch (req.method) {
      case "GET":
        const carts = await prisma.cart.findMany({ where: { sessionId } });
        return res.status(200).json(carts);

      case "POST":
        const { productId, quantity } = req.body;

        // Validate productId and quantity before processing.
        if (!productId || typeof quantity !== "number" || quantity <= 0) {
          return res.status(400).json({
            error: "Invalid productId or quantity.",
          });
        }

        const cartItem = await prisma.cart.create({
          data: {
            productId,
            sessionId,
            quantity,
          },
        });
        return res.status(201).json(cartItem);

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error handling cart request:", error);

    // Send a detailed error message for better debugging.
    // Note: In a production environment, you might want to limit the amount of detail exposed.
    return res.status(500).json({
      error: `An error occurred: ${error.message}`,
    });
  } finally {
    // Ensure that the Prisma client connection is closed after the operation.
    await prisma.$disconnect();
  }
}
