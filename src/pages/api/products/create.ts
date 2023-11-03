import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";
import * as yup from "yup";
import { Prisma } from "@prisma/client";

// Define a schema to validate the product data
const productSchema = yup.object().shape({
  name: yup.string().required(),
  currency: yup.string().required().length(3),
  price: yup.number().positive().required(),
  description: yup.string().required(),
  flag: yup.string().oneOf(["new", "on_sale", "regular"]).required(),
  imageUrl: yup.string().url().required(),
  rating: yup.number().min(0).max(5).required(),
  ratingCount: yup.number().min(0).required(),
  features: yup.array(yup.string()).required(),
  salePrice: yup.number().positive(),
  createdAt: yup.date().default(function () {
    return new Date();
  }),
  updatedAt: yup.date().default(function () {
    return new Date();
  }),
});

export default async function createProduct(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const validatedProduct = await productSchema.validate(req.body);

      const newProduct = await prisma.product.create({
        data: validatedProduct as unknown as Prisma.ProductCreateInput, // Cast to the expected type
      });

      res.status(200).json(newProduct);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).end();
  }
}
