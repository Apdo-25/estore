import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = session.user.id;
    const cart = await prisma.cart.findFirst({
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
      console.error("Cart not found for user:", userId); // Debugging
      return res.status(404).json({ error: "Cart not found" });
    }
    console.log("Cart:", cart); // Debugging
    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: item.product.currency,
        product_data: {
          name: item.product.name,
          images: [item.product.imageUrl],
        },
        unit_amount: Math.round(
          (item.product.salePrice || item.product.price) * 100
        ),
      },
      quantity: item.quantity,
    }));

    if (lineItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }
    console.log("Line Items:", lineItems); // Debugging
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
    });

    return res.status(200).json({ checkoutUrl: checkoutSession.url });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end("Method Not Allowed");
  }
}
