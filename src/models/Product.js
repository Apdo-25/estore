import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  currency: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  flag: {
    type: String,
    enum: ["new", "on-sale", "regular"],
    default: "regular",
  },
  imageUrl: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  ratingCount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: [
    {
      type: String,
    },
  ],
  salePrice: {
    type: Number,
  },

  timestamps: true,
});

const Product = mongoose.model("Product", productSchema);

export default Product;
