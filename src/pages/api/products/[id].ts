import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function getProductById(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  try {
    if (req.method === "GET") {
      const product = await prisma.product.findUnique({
        where: { id: String(id) },
      });

      if (!product) return res.status(404).json({ error: "Product not found" });
      return res.status(200).json(product);
    } else if (req.method === "DELETE") {
      await prisma.product.delete({ where: { id: id.toString() } });
      res.status(204).end();
    } else if (req.method === "PUT") {
      const { id, ...data } = req.body;

      const updatedProduct = await prisma.product.update({
        where: { id },
        data,
      });

      res.status(200).json(updatedProduct);
    } else {
      res.status(405).end(); // Unsupported HTTP method
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
