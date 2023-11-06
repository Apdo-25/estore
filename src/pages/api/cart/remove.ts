import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

// Reuse the same helper function from add.ts
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

  try {
    // Get the cartId before deletion to recalculate the total price later
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });
    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Delete the cart item
    await prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });

    // Calculate the new total price
    const totalPrice = await calculateTotalPrice(cartItem.cartId);

    // Update the cart with the new total price
    const updatedCart = await prisma.cart.update({
      where: { id: cartItem.cartId },
      data: { totalPrice },
    });

    res
      .status(200)
      .json({ message: "Product removed from cart successfully", updatedCart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
